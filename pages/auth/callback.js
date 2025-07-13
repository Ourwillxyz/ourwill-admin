// pages/auth/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../src/supabaseClient';

export default function AuthCallback() {
  const [status, setStatus] = useState('Processing login...');
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        setStatus('❌ Login failed. Please try again.');
        return;
      }

      setStatus('✅ Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    };

    verifySession();
  }, [router]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h2>{status}</h2>
    </div>
  );
}
