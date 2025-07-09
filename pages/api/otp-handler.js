import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHOMAIL_USER,
    pass: process.env.61JZpi6NH444, // <- Your app password here
  },
});
