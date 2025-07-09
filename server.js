const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Step 1: Configure your Zoho SMTP credentials here:
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465, // Use 587 for TLS if you prefer
  secure: true, // true for 465, false for 587
  auth: {
    user: 'your_email@yourdomain.com',        // <-- Your Zoho email address
    pass: 'YOUR_ZOHO_APP_PASSWORD'            // <-- Your Zoho app password (not your account password)
  }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Step 2: This endpoint will send OTP via email when called from your frontend:
app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  const mailOptions = {
    from: '"Your App Name" <your_email@yourdomain.com>', // Friendly from name + email
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent to email!' });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Email OTP backend running on http://localhost:5000');
});
