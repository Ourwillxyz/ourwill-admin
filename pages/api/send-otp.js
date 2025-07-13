// pages/api/send-otp.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: 'Email is required.' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'https://ourwill.vercel.app/auth/callback',
      },
    });

    if (error) {
      console.error('Supabase OTP Error:', error.message);
      return res
        .status(500)
        .json({ success: false, message: 'Failed to send OTP.', error: error.message });
    }

    return res
      .status(200)
      .json({ success: true, message: 'OTP sent successfully!' });

  } catch (err) {
    console.error('Unexpected Error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Unexpected server error.', error: err.message });
  }
}
