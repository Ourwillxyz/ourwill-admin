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
    user: 'admin@ourwill.xyz', // Replace with your Zoho email
    pass: 'ZUrhCWsspAMc' // Replace with your Zoho app password
  }
});

// Utility function to generate a random 4-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// POST /send-otp endpoint: receives { email, otp } and sends email
app.post('/send-otp', async (req, res) => {
  console.log('Raw req.body:', req.body); // Debug log

  // Destructure and validate request body
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  // Prepare mail options
  const mailOptions = {
    from: '"OurWill" <admin@ourwill.xyz>',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };

  // Try sending the email
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent to email!' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Optional GET route for testing server status
app.get('/', (req, res) => {
  res.send('Email OTP backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Email OTP backend running on http://localhost:${PORT}`);
});
