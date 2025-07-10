const nodemailer = require('nodemailer');

// Configure your Zoho SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@ourwill.xyz',        // <-- Replace with your Zoho email address
    pass: '61JZpi6NH444'              // <-- Replace with your Zoho app password (not your login password)
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000,
  socketTimeout: 10000
});

// Function to generate a 4-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Function to send email with OTP
async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: '"Your App Name" <admin@ourwill.xyz>',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { generateOTP, sendOTPEmail };
