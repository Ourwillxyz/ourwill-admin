import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const SECRET = 'ourwill_secret_key';

export default function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token found' });
  }

  try {
    jwt.verify(token, SECRET);
    return res.status(200).json({ message: 'Token valid' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}