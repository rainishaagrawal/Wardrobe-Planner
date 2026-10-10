import React from 'react';
import { Heart } from 'lucide-react';

const WardrobeCard = ({ item, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{ 
        background: 'white', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
        border: '1px solid rgba(0,0,0,0.02)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <div style={{ position: 'relative', height: '300px', background: '#F8F6F2' }}>
        <img 
          src={item.imageUrl || 'https://via.placeholder.com/400x500?text=No+Image'} 
          alt={item.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Heart size={16} color="#A0AEC0" />
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '1rem', color: '#1A202C', fontWeight: 600 }}>{item.name}</h4>
          <span style={{ color: '#A0AEC0', letterSpacing: '1px' }}>•••</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#A0AEC0' }}>
          {item.category} • {item.formality || 'Casual'}
        </div>
        
        {/* Colors */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          {item.primaryColor && (
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.primaryColor, border: '1px solid rgba(0,0,0,0.1)' }}></div>
          )}
          {item.secondaryColor && (
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.secondaryColor, border: '1px solid rgba(0,0,0,0.1)' }}></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WardrobeCard;
