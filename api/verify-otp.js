const OTP_STORE = require('./otp-store.js');

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    return res.status(400).json({ error: "Mobile and OTP required" });
  }
  const entry = OTP_STORE[mobile];
  if (!entry) return res.status(400).json({ error: "No OTP sent to this mobile" });
  if (Date.now() > entry.expires) return res.status(400).json({ error: "OTP expired" });
  if (entry.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

  delete OTP_STORE[mobile];
  // Registration success: add user creation logic here if needed
  return res.status(200).json({ success: true, message: "OTP verified, registration complete" });
}
