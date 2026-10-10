import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { Cloud, MoreHorizontal, Shirt, CalendarCheck, Briefcase, Footprints } from 'lucide-react';
import PlannerDayEditor from './PlannerDayEditor';
import RegenerateDayModal from './RegenerateDayModal';

const PlannerDayCard = ({ planId, day, onUpdate, onRegenerate, onMarkWorn, onSkip }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [regenOpen, setRegenOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const dateObj = new Date(day.date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const outfit = day.outfit;
  const items = outfit?.items || [];
  const status = day.status || 'planned';

  const handleWorn = async () => {
    setMenuOpen(false);
    setActionLoading(true);
    await onMarkWorn(planId, day.date);
    setActionLoading(false);
  };

  const handleSkip = async () => {
    setMenuOpen(false);
    setActionLoading(true);
    await onSkip(planId, day.date);
    setActionLoading(false);
  };

  const handleUpdate = async (data) => {
    await onUpdate(planId, day.date, data);
  };

  const handleRegenerate = async (data) => {
    await onRegenerate(planId, day.date, data);
  };

  const renderCollage = (itemsToRender) => {
    if (!itemsToRender || itemsToRender.length === 0) {
      return <div style={{ width: '100%', height: '100%', background: '#F8F6F2' }} />;
    }
    const displayItems = itemsToRender.slice(0, 4);
    
    if (displayItems.length === 1) {
      return <img src={displayItems[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
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

  const getIcon = (category) => {
    const color = "#718096";
    if (category === 'shoes') return <Footprints size={18} color={color} />;
    if (category === 'accessory' || category === 'accessories') return <Briefcase size={18} color={color} />;
    return <Shirt size={18} color={color} />;
  };

  const outfitName = outfit?.name || (items.length ? items.slice(0,2).map(i => i.item?.category || i.category).join(' + ') : 'Casual Day Out');
  const outfitTags = outfit?.tags || ['Comfortable', 'Classy', 'Effortless'];

  const getDayBgColor = (dayStr) => {
    switch (dayStr) {
      case 'MON': return '#FFF5F0';
      case 'TUE': return '#F0F7FF';
      case 'WED': return '#F5F0FF';
      case 'THU': return '#F0FFF5';
      case 'FRI': return '#FEF7F4';
      default: return '#F8F9FA';
    }
  };

  const bg = getDayBgColor(dayName);

  return (
    <div style={{ background: bg, borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', opacity: status === 'skipped' ? 0.7 : 1, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1A202C', letterSpacing: '0.5px' }}>{dayName}</div>
          <div style={{ color: '#718096', fontSize: '0.95rem' }}>{dateStr}</div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {day.weatherSnapshot && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ color: day.weatherSnapshot.condition.toLowerCase().includes('sun') ? '#ED8936' : '#A0AEC0' }}>
                {day.weatherSnapshot.condition.toLowerCase().includes('sun') ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <Cloud size={24} />
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1A202C' }}>{day.weatherSnapshot.temperature}&deg;C</div>
                <div style={{ fontSize: '0.8rem', color: '#718096', textTransform: 'capitalize' }}>{day.weatherSnapshot.condition}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Image & Items Area */}
      <div style={{ display: 'flex', gap: '16px', flex: 1, marginBottom: '24px', height: '260px' }}>
        {actionLoading ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0AEC0', animation: 'pulse 1.5s infinite', background: 'white', borderRadius: '16px' }}>Updating...</div>
        ) : !outfit ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#A0AEC0', background: 'white', borderRadius: '16px' }}>
            No outfit planned
            <button style={{ marginTop: '12px', padding: '8px 16px', borderRadius: '100px', border: '1px solid #EAEAEA', background: 'white', cursor: 'pointer' }} onClick={() => setRegenOpen(true)}>Generate</button>
          </div>
        ) : (
          <>
            {/* Left Main Image (Using first item) */}
            <div style={{ flex: '1 1 50%', borderRadius: '16px', overflow: 'hidden', background: 'white' }}>
              {items.length > 0 && (
                <img src={(items[0].item || items[0]).imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="main outfit item" />
              )}
            </div>
            
            {/* Right Grid of Items */}
            <div style={{ flex: '1 1 50%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: '8px' }}>
              {items.slice(1, 7).map((itemObj, idx) => {
                const item = itemObj.item || itemObj;
                return (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '12px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={item.category} />
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <button 
          onClick={() => outfit && navigate(`/app/outfits/${outfit._id}`)}
          disabled={actionLoading || !outfit}
          style={{ 
            padding: '10px 24px', borderRadius: '100px', 
            background: 'rgba(0,0,0,0.06)', color: '#4A5568', 
            border: 'none', cursor: (actionLoading || !outfit) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontWeight: 600, fontSize: '0.9rem',
            opacity: (!outfit || actionLoading) ? 0.6 : 1
          }}
        >
          View Outfit
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
        
        <div style={{ position: 'relative' }}>
          <button style={{ background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', color: '#718096', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setMenuOpen(!menuOpen)}>
            <MoreHorizontal size={20} />
          </button>
          
          {menuOpen && (
            <div style={{ position: 'absolute', right: 0, bottom: '48px', background: 'white', border: '1px solid #EAEAEA', borderRadius: '12px', padding: '8px 0', zIndex: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.1)', minWidth: '150px' }}>
              <button className="menu-item" onClick={() => { setMenuOpen(false); setEditOpen(true); }} style={{ padding: '8px 16px', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: '#4A5568' }}>Edit Context</button>
              {status !== 'worn' && <button className="menu-item" onClick={() => { setMenuOpen(false); setRegenOpen(true); }} style={{ padding: '8px 16px', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: '#4A5568' }}>Regenerate</button>}
              {status !== 'worn' && <button className="menu-item" onClick={handleWorn} style={{ padding: '8px 16px', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: '#4A5568' }}>Mark Worn</button>}
              {status !== 'skipped' && <button className="menu-item" onClick={handleSkip} style={{ color: '#E53E3E', padding: '8px 16px', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>Skip</button>}
            </div>
          )}
        </div>
      </div>

      <PlannerDayEditor isOpen={editOpen} onClose={() => setEditOpen(false)} day={day} onSubmit={handleUpdate} />
      <RegenerateDayModal isOpen={regenOpen} onClose={() => setRegenOpen(false)} day={day} onSubmit={handleRegenerate} />

    </div>
  );
};
export default PlannerDayCard;
