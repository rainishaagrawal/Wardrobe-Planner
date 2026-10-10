import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOutfit, markOutfitWorn } from '../../services/outfitApi';
import { getApiErrorMessage } from '../../services/api';
import Button from '../common/Button';
import { Shirt, Bookmark, Check, AlertCircle } from 'lucide-react';

const OutfitRecommendationCard = ({ outfit }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [wearing, setWearing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccessMsg('');
    try {
      await saveOutfit(outfit._id);
      setSuccessMsg('Outfit saved');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleWear = async () => {
    setWearing(true); setError(''); setSuccessMsg('');
    try {
      await markOutfitWorn(outfit._id);
      setSuccessMsg('Marked as worn');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setWearing(false);
    }
  };

  const items = outfit.items || [];
  const reasons = outfit.reasons || [];

  return (
    <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', background: '#F8F7F4', borderBottom: '1px solid var(--color-border)', overflowX: 'auto', padding: '16px', gap: '16px' }}>
        {items.map((itemObj, idx) => {
          const item = itemObj.item || itemObj; 
          return (
            <div key={item._id || idx} onClick={() => item._id && navigate(`/app/wardrobe/${item._id}`)} style={{ cursor: item._id ? 'pointer' : 'default', minWidth: '100px', flexShrink: 0 }}>
              <div style={{ aspectRatio: '4/5', background: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Shirt size={32} color="var(--color-muted)" opacity={0.5} />}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name || 'Unknown item'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', textTransform: 'capitalize' }}>{item.category}</div>
            </div>
          );
        })}
      </div>
      
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {(outfit.aesthetics || []).map((aes, i) => (
             <span key={i} className="badge" style={{ border: '1px solid var(--color-border)', fontSize: '0.7rem' }}>{aes}</span>
          ))}
          {outfit.formality && <span className="badge" style={{ border: '1px solid var(--color-border)', fontSize: '0.7rem', textTransform: 'capitalize' }}>{outfit.formality.replace('smartCasual', 'Smart Casual')}</span>}
        </div>
        
        {reasons.length > 0 && (
          <div style={{ marginBottom: '24px', flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '4px' }}>Why this works</strong>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
              {reasons.slice(0, 3).map((r, i) => <li key={i} style={{ marginBottom: '4px' }}>{r}</li>)}
            </ul>
          </div>
        )}

        {error && <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}><AlertCircle size={14}/> {error}</div>}
        {successMsg && <div style={{ color: 'green', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}><Check size={14}/> {successMsg}</div>}

        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
          <Button style={{ flex: 1 }} onClick={() => navigate(`/app/outfits/${outfit._id || ''}`)} disabled={!outfit._id}>View Outfit</Button>
          <Button variant="ghost" style={{ width: '48px', padding: 0, border: '1px solid var(--color-border)' }} onClick={handleSave} disabled={saving || successMsg === 'Outfit saved' || !outfit._id} aria-label="Save Outfit"><Bookmark size={18} /></Button>
          <Button variant="ghost" style={{ width: '48px', padding: 0, border: '1px solid var(--color-border)' }} onClick={handleWear} disabled={wearing || successMsg === 'Marked as worn' || !outfit._id} aria-label="Mark Worn"><Check size={18} /></Button>
        </div>
      </div>
    </div>
  );
};

export default OutfitRecommendationCard;
