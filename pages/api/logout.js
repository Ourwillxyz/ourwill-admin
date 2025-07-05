// pages/api/logout.js

import { serialize } from 'cookie';

export default function handler(req, res) {
  const serialized = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0),
  });

  res.setHeader('Set-Cookie', serialized);
  res.status(200).json({ message: 'Logout successful' });
}
