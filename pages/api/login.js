import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const SECRET_KEY = 'ourwill-secret-key'; // In production, use env variable

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // ✅ Hardcoded credentials
  const validEmail = 'admin@ourwill.xyz';
  const validPassword = 'OurWillSecure!2024';

  if (email === validEmail && password === validPassword) {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        sameSite: 'strict',
        path: '/',
      })
    );

    return res.status(200).json({ message: 'Login successful' });
  }

  return res.status(401).json({ message: 'Login failed, please try again' });
}
