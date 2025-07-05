import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  // Hardcoded login credentials
  const validEmail = 'admin@ourwill.xyz';
  const validPassword = 'SecureVote2027';

  if (email === validEmail && password === validPassword) {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '2h' });

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60, // 2 hours
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ message: 'Login successful' });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
}
