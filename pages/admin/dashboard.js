import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/token-check');
      if (!res.ok) {
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/logout');
    router.push('/admin/login');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome to Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}