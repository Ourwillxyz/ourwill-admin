app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  // Generate a 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const mailOptions = {
    from: '"Your App Name" <admin@ourwill.xyz>',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent to email!' });
    // For real apps, save the OTP with the email in database or cache for later verification!
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
