const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@ourwill.xyz',
    pass: '61JZpi6NH444'
  }
});

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

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
