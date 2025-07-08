const OTP_STORE = require('./otp-store.js');

const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

function generateOTP() {
  // 4-digit OTP
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Mock SMS sender: logs OTP to the server console
async function sendSMS(mobile, otp) {
  console.log(`Mock SMS: Send OTP ${otp} to mobile ${mobile}`);
  return true;
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

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
    // For DEV ONLY: Return OTP in response so frontend can use it
    return res.status(200).json({ success: true, message: "OTP sent (mock SMS)", otp }); 
  } catch (err) {
    return res.status(500).json({ error: "Failed to send OTP" });
  }
}
