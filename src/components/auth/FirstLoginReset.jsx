import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const FirstLoginReset = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) setMessage('Missing user id for first-login password change');
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/complete-first-login', { userId, password });
      setMessage('Password updated. Please sign in.');
      setTimeout(()=> navigate('/signin'), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Set your password</h2>
      <p>Please choose a new password to complete your account setup.</p>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 8 }}>
          <label>New password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn-primary">Save password</button>
        </div>
      </form>
      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
};

export default FirstLoginReset;
