const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure Nodemailer for Zoho SMTP (port 587, secure: false)
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: 'admin@ourwill.xyz', // <-- Your Zoho email address
    pass: 'vhFa9E4vhFUi' // <-- Your Zoho app password (not your regular password)
  }
});

// Endpoint to send OTP email
app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;

  // Simple validation
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP are required.' });
  }

  try {
    // Send email
    let info = await transporter.sendMail({
      from: '"OurWill Admin" <admin@ourwill.xyz>', // sender
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP code is: <b>${otp}</b></p>`
    });

    return res.json({ success: true, message: 'OTP sent to email!', info });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Email OTP backend running on http://localhost:${PORT}`);
});
