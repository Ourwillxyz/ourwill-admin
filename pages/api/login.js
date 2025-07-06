import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const SECRET_KEY = 'ourwill_secret';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Hardcoded credentials (change to your preferred values)
  const validUsername = 'admin';
  const validPassword = 'ourwill2025';

  if (username === validUsername && password === validPassword) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        path: '/'
      })
    );

    return res.status(200).json({ message: 'Login successful', token });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
}
