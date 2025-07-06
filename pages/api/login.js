import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // ✅ Set your actual login credentials here
  const adminEmail = 'admin@ourwill.xyz';
  const adminPassword = 'OurWillSecure!2024';

  // ✅ Check login match
  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email }, 'your_jwt_secret', { expiresIn: '2h' });

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2 * 60 * 60,
        path: '/',
        sameSite: 'lax',
      })
    );

    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
}
