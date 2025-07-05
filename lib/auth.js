import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

export function verifyToken(req) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}
