import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required." });
  }

  // Configure nodemailer with Zoho SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"OurWill" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(200).json({ success: true, message: "OTP sent to email!" });
  } catch (error) {
    // Log error for debugging
    console.error("Error sending OTP email:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP email.", error: error.message });
  }
}import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  // Configure nodemailer with Zoho SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_APP_PASSWORD
    }
  });

  try {
    // Send email
    await transporter.sendMail({
      from: `"OurWill" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`
    });
    res.status(200).json({ success: true, message: 'OTP sent to email!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
