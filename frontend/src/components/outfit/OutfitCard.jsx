import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

const OutfitCard = ({ outfit, onClick, loadingId }) => {
  const isCreating = loadingId === (outfit.tempId || outfit._id);
  const items = outfit.items || [];
  
  const name = outfit.name || (items.length ? items.slice(0,2).map(i => i.category).join(' + ') : 'AI Suggestion');
  const mainItem = items.length > 0 ? items[0] : null;
  const tags = outfit.tags || (mainItem ? [mainItem.formality || 'Casual'] : ['Casual']);
  const colors = outfit.colors || (items.length ? items.map(i => i.primaryColor).filter(Boolean) : ['#A0AEC0', '#1A1A1A']);

  const renderCollage = () => {
    if (!items || items.length === 0) {
      return <img src={outfit.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400'} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    }
    const displayItems = items.slice(0, 4);
    
    if (displayItems.length === 1) {
      return <img src={displayItems[0].imageUrl} alt={displayItems[0].name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    }
    
    if (displayItems.length === 2) {
      return (
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
          <img src={displayItems[0].imageUrl} style={{ width: '50%', height: '100%', objectFit: 'cover', borderRight: '2px solid white' }} />
          <img src={displayItems[1].imageUrl} style={{ width: '50%', height: '100%', objectFit: 'cover' }} />
        </div>
      );
    }
    
    if (displayItems.length === 3) {
      return (
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
          <img src={displayItems[0].imageUrl} style={{ width: '50%', height: '100%', objectFit: 'cover', borderRight: '2px solid white' }} />
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
            <img src={displayItems[1].imageUrl} style={{ width: '100%', height: '50%', objectFit: 'cover', borderBottom: '2px solid white' }} />
            <img src={displayItems[2].imageUrl} style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
          </div>
        </div>
      );
    }
    
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', height: '100%', width: '100%', gap: '2px', background: 'white' }}>
        {displayItems.map((item, idx) => (
          <img key={idx} src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ))}
      </div>
    );
  };

  return (
    <div 
      onClick={() => !isCreating && onClick(outfit)}
      style={{ 
        background: 'white', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
        border: '1px solid rgba(0,0,0,0.02)',
        cursor: isCreating ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        opacity: isCreating ? 0.7 : 1,
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', height: '280px', background: '#F8F6F2' }}>
        {renderCollage()}
        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Heart size={16} color="#A0AEC0" />
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1A202C', fontWeight: 600, textTransform: 'capitalize' }}>
            {isCreating ? 'Creating...' : name}
          </h4>
          <MoreHorizontal size={16} color="#A0AEC0" />
        </div>
        <div style={{ fontSize: '0.8rem', color: '#A0AEC0', textTransform: 'capitalize' }}>
          {tags.join(' • ')}
        </div>
        
        {/* Colors */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
          {colors.slice(0, 4).map((c, i) => (
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

let globalOutfitsCache = {
  date: null,
  data: []
};


export default OutfitCard;
