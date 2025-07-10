const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configure your email transporter (using Zoho SMTP as per your info)
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@ourwill.xyz', // Your Zoho email address
    pass: '61JZpi6NH444'       // Your Zoho app password
  }
});

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  // Generate a 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const mailOptions = {
    from: '"OurWill" <admin@ourwill.xyz>',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent to email!' });
    // NOTE: In production, save the OTP tied to the email for later verification!
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Email OTP backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Email OTP backend running on http://localhost:${PORT}`);
});
