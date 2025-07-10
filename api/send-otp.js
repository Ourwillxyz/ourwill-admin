const OTP_STORE = require('./otp-store.js');
const nodemailer = require('nodemailer');

const OTP_EXPIRY = 1 * 60 * 1000; // 1 minute

// Configure your Zoho SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@ourwill.xyz',        // <-- Replace with your Zoho email address
    pass: '61JZpi6NH444'            // <-- Replace with your Zoho app password (not your login password)
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000,
  socketTimeout: 10000
});

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

function generateOTP() {
  // 4-digit OTP
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendEmail(email, otp) {
  const mailOptions = {
    from: '"Your App Name" <admin@ourwill.xyz>', // <-- Replace with your app/email
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };
  console.log(`[OTP] Attempting to send OTP email to ${email}`);
  await transporter.sendMail(mailOptions);
  console.log(`[OTP] Email sent to ${email}`);
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { mobile, email } = req.body;
  if (!mobile || !email) {
    return res.status(400).json({ error: "Mobile number and email are required." });
  }

  const otp = generateOTP();
  OTP_STORE[mobile] = { otp, expires: Date.now() + OTP_EXPIRY };

  try {
    await sendEmail(email, otp);
    return res.status(200).json({ success: true, message: "OTP sent to email" }); // Remove OTP in production!
  } catch (err) {
    console.error("[OTP] Failed to send OTP email:", err);
    return res.status(500).json({ error: "Failed to send OTP", details: err.message });
  }
};
