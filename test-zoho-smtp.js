const nodemailer = require('nodemailer');

// Replace these with your actual Zoho credentials
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "admin@ourwill.xyz", // Your Zoho email address
    pass: "vhFa9E4vhFUi"   // Your Zoho app password!
  }
});

// Change this to your own email for testing
const mailOptions = {
  from: '"Zoho Test" <admin@ourwill.xyz>',
  to: "admin@ourwill.xyz", // The recipient (can be your own address)
  subject: "SMTP Test",
  text: "This is a test email sent from Nodemailer using Zoho SMTP."
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Email send error:", error);
  }
  console.log("Email sent:", info.response);
});
