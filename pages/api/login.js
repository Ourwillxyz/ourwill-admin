import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const SECRET_KEY = 'your_secret_key'; // Replace with a strong key

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Hardcoded credentials (can move to .env later)
  if (username === 'admin' && password === 'ourwill2027') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '2h' });

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2 * 60 * 60,
        sameSite: 'strict',
        path: '/',
      })
    );

    return res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
}
