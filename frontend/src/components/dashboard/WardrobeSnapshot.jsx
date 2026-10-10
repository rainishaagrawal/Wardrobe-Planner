import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const WardrobeSnapshot = ({ stats }) => {
  const navigate = useNavigate();
  
  return (
    <div className="dashboard-card">
      <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Your Wardrobe</h3>
      
      {stats ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{stats.total || 0} pieces</div>
          {stats.laundryCount > 0 && <div style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>{stats.laundryCount} pieces need laundry</div>}
        </div>
      ) : (
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Loading...</p>
      )}

      <Button variant="ghost" onClick={() => navigate('/app/wardrobe')} style={{ width: '100%', border: '1px solid var(--color-border)' }}>View Wardrobe</Button>
    </div>
  );
};

export default WardrobeSnapshot;
