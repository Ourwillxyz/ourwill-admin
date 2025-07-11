const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@ourwill.xyz', // Use your actual Zoho email
    pass: 'ZUrhCWsspAMc' // Use your actual Zoho app password
  }
});

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Sends an OTP email to the specified address.
 * @param {string} email - Recipient email address.
 * @param {string} otp - The OTP code to send.
 * @returns {Promise} - Resolves if sent, rejects if error.
 */
async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: '"OurWill" <admin@ourwill.xyz>', // App name and sender address
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { generateOTP, sendOTPEmail };
