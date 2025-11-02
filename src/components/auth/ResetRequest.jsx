import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await api.post('/auth/request-password-reset', { email });
      setToken(res.data.token);
      setMessage('Password reset token created (demo). Use it to reset your password below.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to request reset');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn-primary">Request reset</button>
          <button type="button" className="btn-secondary" onClick={()=> navigate('/signin')}>Back</button>
        </div>
      </form>

      {message && <div style={{ marginTop: 12 }}>{message}</div>}
      {token && (
        <div style={{ marginTop: 12 }}>
          <strong>Demo token:</strong>
          <div style={{ wordBreak: 'break-all', background: '#f7f7f7', padding: 8, marginTop: 6 }}>{token}</div>
          <div style={{ marginTop: 8 }}>
            <button className="btn-primary" onClick={()=> navigate(`/reset-password?token=${encodeURIComponent(token)}`)}>Use token to reset</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetRequest;
