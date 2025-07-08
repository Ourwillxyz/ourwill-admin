const OTP_STORE = require('./otp-store.js');

const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock SMS sender: logs OTP to the server console
async function sendSMS(mobile, otp) {
  console.log(`Mock SMS: Send OTP ${otp} to mobile ${mobile}`);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { mobile } = req.body;
  if (!mobile) {
    return res.status(400).json({ error: "Mobile number required" });
  }
  const otp = generateOTP();
  OTP_STORE[mobile] = { otp, expires: Date.now() + OTP_EXPIRY };
  try {
    await sendSMS(mobile, otp);
    return res.status(200).json({ success: true, message: "OTP sent (mock SMS)" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to send OTP" });
  }
}
