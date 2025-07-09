import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mobile, email } = req.body;
  if (!mobile || !email) {
    return res.status(400).json({ error: 'Mobile and email are required' });
  }

  // Generate a 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Store OTP in-memory (for demonstration; use a database or cache in production)
  if (!global.otpStore) {
    global.otpStore = {};
  }
  global.otpStore[mobile] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000 // OTP valid for 5 minutes
  };

  // Set up Nodemailer with Zoho SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: 'admin@ourwill.xyz', // Replace with your Zoho email
      pass: '61JZpi6NH444' // <-- REPLACE with your Zoho app password
    }
  });

  try {
    await transporter.sendMail({
      from: '"OurWill" <admin@ourwill.xyz>',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`
    });

    return res.status(200).json({ success: true, message: 'OTP sent to email.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email', detail: error.message });
  }
}
