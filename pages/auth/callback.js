// pages/auth/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../src/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Processing login...');

  useEffect(() => {
    const handleLogin = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        setStatus('❌ Login failed or expired. Try again.');
        return;
      }

      setStatus('✅ Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard'); // Change this to your post-login page
      }, 1500);
    };

    handleLogin();
  }, [router]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h2>{status}</h2>
    </div>
  );
}
