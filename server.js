const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_APP_PASSWORD
  }
});

app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    await transporter.sendMail({
      from: `"OurWill" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`
    });
    res.json({ success: true, message: 'OTP sent to email!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Email OTP backend running on http://localhost:${PORT}`);
});
