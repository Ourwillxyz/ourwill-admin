import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const SECRET_KEY = 'ourwill_secret_key'; // In production, use env variables

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Simple hardcoded credentials (you can update as needed)
    if (username === 'admin' && password === 'ourwill2027') {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '2h' });

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7200, // 2 hours
          path: '/',
        })
      );

      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
