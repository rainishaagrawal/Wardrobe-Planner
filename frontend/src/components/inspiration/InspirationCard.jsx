import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

const InspirationCard = ({ inspiration }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="hover-lift" 
      onClick={() => navigate(`/app/inspiration/${inspiration._id}`)}
      style={{ cursor: 'pointer', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ aspectRatio: '3/4', background: '#F8F7F4', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {inspiration.imageUrl ? (
          <img src={inspiration.imageUrl} alt={inspiration.title || 'Inspiration'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        ) : (
          <ImageIcon size={32} color="var(--color-muted)" opacity={0.5} />
        )}
        {inspiration.analysis && (
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'var(--color-surface)', borderRadius: '50%', padding: '4px', display: 'flex', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Sparkles size={14} color="var(--color-primary)" />
          </div>
        )}
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {inspiration.title || 'Saved Inspiration'}
        </div>
        {inspiration.tags && inspiration.tags.length > 0 && (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {inspiration.tags.map(t => `#${t}`).join(' ')}
          </div>
        )}
      </div>
    </div>
  );
};
export default InspirationCard;
