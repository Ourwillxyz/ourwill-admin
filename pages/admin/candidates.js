import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

export default function CandidateManager() {
  const router = useRouter();
  const [tokenValid, setTokenValid] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    party: '',
    symbol: ''
  });

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      jwt.verify(token, 'your-secret-key');
      setTokenValid(true);
    } catch (err) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    setCandidates([...candidates, formData]);
    setFormData({ name: '', position: '', party: '', symbol: '' });
  };

  if (!tokenValid) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Candidate Manager</h1>
      <form onSubmit={handleAddCandidate} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Candidate Name"
          value={formData.name}
          onChange={handleChange}
          required
        />{' '}
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          required
        />{' '}
        <input
          type="text"
          name="party"
          placeholder="Party"
          value={formData.party}
          onChange={handleChange}
          required
        />{' '}
        <input
          type="text"
          name="symbol"
          placeholder="Symbol URL"
          value={formData.symbol}
          onChange={handleChange}
        />{' '}
        <button type="submit">Add Candidate</button>
      </form>

      <ul>
        {candidates.map((c, idx) => (
          <li key={idx}>
            <strong>{c.name}</strong> – {c.position}, {c.party}
          </li>
        ))}
      </ul>
    </div>
  );
}
