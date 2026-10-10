import React from 'react';
import { Check } from 'lucide-react';

const StyleCard = ({ title, description, selected, onClick }) => {
  return (
    <div 
      className={`style-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <strong style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}>{title}</strong>
        {selected && <Check size={16} color="var(--color-primary)" />}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '4px' }}>
        {description}
      </div>
    </div>
  );
};

export default StyleCard;
