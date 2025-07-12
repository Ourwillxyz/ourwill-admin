import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 587,
      secure: false, // TLS for port 587
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // For testing; set to true for production
      },
    });

    await transporter.sendMail({
      from: `"OurWill OTP" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your One-Time Password is: ${otp}\n\nThis OTP will expire shortly.`,
    });

    return res.status(200).json({ success: true, message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP.', error: error.message });
  }
}
