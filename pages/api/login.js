import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const SECRET = 'ourwill_secret_key';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (email === 'admin@ourwill.xyz' && password === 'ourwill2027') {
    const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600
    }));
    return res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
}