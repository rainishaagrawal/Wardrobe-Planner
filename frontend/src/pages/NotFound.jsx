import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { SearchX } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
        <SearchX size={32} color="var(--color-muted)" />
      </div>
      <h1 style={{ margin: '0 0 16px 0' }}>404</h1>
      <p style={{ color: 'var(--color-text)', fontSize: '1.1rem', margin: '0 0 8px 0' }}>This look doesn't exist.</p>
      <p style={{ color: 'var(--color-muted)', marginBottom: '32px' }}>The page you're looking for may have moved or doesn't belong in your wardrobe.</p>
      <Button onClick={() => navigate('/app')} style={{ width: 'auto' }}>Back to Dashboard</Button>
    </div>
  );
};
export default NotFound;
