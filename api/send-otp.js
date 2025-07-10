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
    pass: '61JZpi6NH444'              // <-- Replace with your Zoho app password (not your login password)
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
  console.log(`[OTP] Preparing to send email to ${email} with OTP: ${otp}`);
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[OTP] Email sent to ${email}, messageId: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[OTP] Error sending email to ${email}:`, err);
    throw err;
  }
}

module.exports = async function handler(req, res) {
  console.log('[OTP] Handler invoked');
  setCors(res);

  if (req.method === "OPTIONS") {
    console.log('[OTP] OPTIONS request, sending 200');
    res.status(200).end();
    return;
  }

  console.log(`[OTP] HTTP method: ${req.method}`);
  if (req.method !== "POST") {
    console.log(`[OTP] Invalid HTTP method: ${req.method}`);
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log('[OTP] Checking request body');
  console.log('req.body:', req.body);

  const { mobile, email } = req.body || {};
  if (!mobile || !email) {
    console.log('[OTP] Missing mobile or email:', { mobile, email });
    return res.status(400).json({ error: "Mobile number and email are required." });
  }

  console.log(`[OTP] Generating OTP for mobile: ${mobile}, email: ${email}`);
  const otp = generateOTP();
  console.log(`[OTP] OTP generated: ${otp}`);

  OTP_STORE[mobile] = { otp, expires: Date.now() + OTP_EXPIRY };
  console.log(`[OTP] OTP stored for ${mobile}:`, OTP_STORE[mobile]);

  try {
    console.log(`[OTP] Calling sendEmail for ${email}`);
    await sendEmail(email, otp);
    console.log(`[OTP] OTP email sent, responding success`);
    return res.status(200).json({ success: true, message: "OTP sent to email" }); // Remove OTP in production!
  } catch (err) {
    console.error("[OTP] Failed to send OTP email:", err);
    return res.status(500).json({ error: "Failed to send OTP", details: err.message });
  }
};
