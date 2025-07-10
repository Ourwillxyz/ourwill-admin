const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configure Nodemailer with your Zoho SMTP credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@ourwill.xyz', // replace with your actual Zoho email
    pass: 'YOUR_ZOHO_APP_PASSWORD' // replace with your actual app password
  }
});

// POST /send-otp endpoint: receives { email, otp } and sends email
app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  const mailOptions = {
    from: '"OurWill" <admin@ourwill.xyz>',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent to email!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Email OTP backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Email OTP backend running on http://localhost:${PORT}`);
});
