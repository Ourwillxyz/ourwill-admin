import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token || '';

  try {
    jwt.verify(token, 'ourwill-secret-key'); // same key used during login
    return { props: {} };
  } catch (error) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
}

export default function AdminDashboard() {
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1>Welcome to the Admin Dashboard</h1>
      <p>This area is protected and requires login.</p>
    </div>
  );
}
