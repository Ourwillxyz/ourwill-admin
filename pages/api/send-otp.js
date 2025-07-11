// This is a Next.js API route for sending OTP via Zoho SMTP

import nodemailer from "nodemailer"; // Only ONE import, at the very top

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const { email, otp } = req.body;

  // Check that both email and otp are provided
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required." });
  }

  // Set up Nodemailer transporter for Zoho SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,        // Your Zoho email address (set in environment variables)
      pass: process.env.ZOHO_APP_PASSWORD, // Your Zoho app password (set in environment variables)
    },
  });

  try {
    // Send the email
    await transporter.sendMail({
      from: `"OurWill" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    // Success response
    return res.status(200).json({ success: true, message: "OTP sent to email!" });
  } catch (error) {
    // Error response
    console.error("Error sending OTP email:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP email.", error: error.message });
  }
}
