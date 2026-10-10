import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const StyleDNACompact = ({ styleProfile }) => {
  const navigate = useNavigate();
  
  if (!styleProfile) {
    return (
      <div className="dashboard-card">
        <h3 style={{ marginTop: 0 }}>Your Style DNA</h3>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Style profile unavailable</p>
        <Button variant="ghost" style={{ width: 'auto', padding: 0 }} onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    );
  }

  const { aesthetics = [], preferredColors = [], preferredFits = [] } = styleProfile;

  return (
    <div className="dashboard-card">
      <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Your Style DNA</h3>
      
      {aesthetics.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {aesthetics.slice(0, 4).map((aes, i) => (
              <span key={i} className="badge" style={{ border: '1px solid var(--color-border)' }}>{aes.name || aes}</span>
            ))}
          </div>
        </div>
      )}

      {preferredColors.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Preferred Colors</strong>
          <span style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>{preferredColors.join(' · ')}</span>
        </div>
      )}

      {preferredFits.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Fit</strong>
          <span style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>{preferredFits.join(' · ')}</span>
        </div>
      )}

      <Button variant="ghost" onClick={() => navigate('/app/profile')} style={{ width: '100%', border: '1px solid var(--color-border)' }}>Edit Style</Button>
    </div>
  );
};

export default StyleDNACompact;
