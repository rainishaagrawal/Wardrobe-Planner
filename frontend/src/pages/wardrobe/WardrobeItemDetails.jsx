import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWardrobeItem, deleteWardrobeItem, markWardrobeItemWorn, updateLaundryStatus } from '../../services/wardrobeApi';
import { getApiErrorMessage } from '../../services/api';
import Button from '../../components/common/Button';
import { Shirt, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
import Modal from '../../components/common/Modal';
import AIAnalysisCard from '../../components/wardrobe/AIAnalysisCard';

const WardrobeItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchItem(); }, [id]);

  const fetchItem = async () => {
    try { const res = await getWardrobeItem(id); setItem(res.data?.item || res.data?.data?.item || res.data); } 
    catch (err) { setError(getApiErrorMessage(err)); } 
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try { await deleteWardrobeItem(id); navigate('/app/wardrobe', { replace: true }); } 
    catch (err) { setError(getApiErrorMessage(err)); setActionLoading(false); setDeleteModalOpen(false); }
  };

  const handleWear = async () => {
    setActionLoading(true);
    try { await markWardrobeItemWorn(id); await fetchItem(); } 
    catch (err) { setError(getApiErrorMessage(err)); } 
    finally { setActionLoading(false); }
  };
  
  const handleLaundry = async (status) => {
    setActionLoading(true);
    try { await updateLaundryStatus(id, status); await fetchItem(); } 
    catch (err) { setError(getApiErrorMessage(err)); } 
    finally { setActionLoading(false); }
  };

  const handleItemUpdate = (updatedItem) => {
    // If backend returns the nested data
    if (updatedItem.data?.item) {
      setItem(updatedItem.data.item);
    } else {
      setItem(updatedItem);
    }
  };

  if (loading) return <div className="app-container">Loading...</div>;
  if (error || !item) return <div className="app-container">{error || 'Item not found'}</div>;

  return (
    <div className="app-container">
      <Button variant="ghost" style={{ width: 'auto', padding: '0 0 16px 0' }} onClick={() => navigate('/app/wardrobe')}><ArrowLeft size={16} /> Back to Wardrobe</Button>
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <div style={{ aspectRatio: '4/5', background: '#F0EFEA', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Shirt size={64} color="var(--color-muted)" opacity={0.5} />}
            {item.aiAnalysis?.analyzed && (
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', padding: '6px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <Sparkles size={14} color="var(--color-primary)" /> AI Analyzed
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: '2 1 400px' }}>
          <h1 style={{ marginBottom: '8px' }}>{item.name}</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', marginTop: 0, textTransform: 'capitalize' }}>{item.category} &middot; {item.primaryColor}</p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <span className="badge" style={{ border: '1px solid var(--color-border)' }}>{item.laundryStatus}</span>
            <span className="badge" style={{ border: '1px solid var(--color-border)' }}>{item.availability}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div><strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Formality</strong><span style={{textTransform: 'capitalize'}}>{(item.formality || '').replace('smartCasual', 'Smart Casual') || '-'}</span></div>
            <div><strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Pattern</strong><span style={{textTransform: 'capitalize'}}>{item.pattern || '-'}</span></div>
            <div><strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Wear Count</strong>{item.wearCount}</div>
            <div><strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Last Worn</strong>{item.lastWornAt ? new Date(item.lastWornAt).toLocaleDateString() : 'Never'}</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
            <Button style={{ width: 'auto' }} onClick={handleWear} disabled={actionLoading}>Mark Worn</Button>
            <Button variant="ghost" style={{ width: 'auto', border: '1px solid var(--color-border)' }} onClick={() => navigate(`/app/wardrobe/${id}/edit`)}>Edit Details</Button>
            {item.laundryStatus === 'clean' ? (<Button variant="ghost" style={{ width: 'auto', border: '1px solid var(--color-border)' }} onClick={() => handleLaundry('dirty')} disabled={actionLoading}>Mark Dirty</Button>) : (<Button variant="ghost" style={{ width: 'auto', border: '1px solid var(--color-border)' }} onClick={() => handleLaundry('clean')} disabled={actionLoading}>Mark Clean</Button>)}
            <Button variant="ghost" style={{ width: 'auto', color: 'var(--color-danger)' }} onClick={() => setDeleteModalOpen(true)}><Trash2 size={18} /></Button>
          </div>

          <AIAnalysisCard item={item} onUpdate={handleItemUpdate} />
        </div>
      </div>
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Item?">
        <p>This will permanently remove the item from your wardrobe.</p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button style={{ background: 'var(--color-danger)' }} onClick={handleDelete} loading={actionLoading}>Delete Item</Button>
        </div>
      </Modal>
    </div>
  );
};
export default WardrobeItemDetails;