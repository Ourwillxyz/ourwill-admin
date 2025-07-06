import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminDashboard({ isAuthenticated }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Admin Dashboard</h1>
      <ul>
        <li><a href="/admin/candidates">Manage Candidates</a></li>
        <li><a href="/admin/settings">Settings</a></li>
        <li><a href="/admin/logout">Logout</a></li>
      </ul>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token || '';

  try {
    jwt.verify(token, 'secret-key'); // replace with env in production
    return { props: { isAuthenticated: true } };
  } catch (err) {
    return { props: { isAuthenticated: false } };
  }
}
