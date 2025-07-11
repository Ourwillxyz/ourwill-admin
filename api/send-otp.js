const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_APP_PASSWORD
  }
});

// Example function to send OTP email
async function sendOtp(email, otp) {
  try {
    await transporter.sendMail({
      from: `"OurWill" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`
    });
    return { success: true, message: 'OTP sent to email!' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { sendOtp };
