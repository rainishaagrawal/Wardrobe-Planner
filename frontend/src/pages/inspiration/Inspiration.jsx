import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInspirations, createInspiration } from '../../services/inspirationApi';
import { getApiErrorMessage } from '../../services/api';
import Button from '../../components/common/Button';
import InspirationCard from '../../components/inspiration/InspirationCard';
import AddInspirationModal from '../../components/inspiration/AddInspirationModal';
import { Plus, Search, Image as ImageIcon } from 'lucide-react';

const Inspiration = () => {
  const [inspirations, setInspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const fetchInspirations = async (searchQuery = '') => {
    setLoading(true); setError('');
    try {
      const res = await getInspirations(searchQuery ? { search: searchQuery } : {});
      const data = res.data?.data?.inspirations || res.data?.inspirations || res.data || [];
      setInspirations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchInspirations(search);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleAdd = async (data) => {
    setAdding(true);
    try {
      const res = await createInspiration(data);
      const newInsp = res.data?.data?.inspiration || res.data?.inspiration || res.data;
      setInspirations(prev => [newInsp, ...prev]);
      setAddModalOpen(false);
    } catch (err) {
      alert(getApiErrorMessage(err) || 'Failed to add inspiration');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Inspiration</h1>
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>Save looks. Capture aesthetics. Style them with what you own.</p>
        </div>
        <Button style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setAddModalOpen(true)}>
          <Plus size={16} /> Add Inspiration
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0 12px', flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--color-muted)" />
          <input 
            type="text" 
            placeholder="Search inspiration..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: '12px', width: '100%', outline: 'none' }}
          />
        </div>
      </div>

      {loading && inspirations.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: '300px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : error ? (
        <div style={{ color: 'var(--color-danger)' }}>{error}</div>
      ) : inspirations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-bg)', marginBottom: '16px' }}>
            <ImageIcon size={32} color="var(--color-primary)" />
          </div>
          <h3 style={{ margin: '0 0 12px 0' }}>Build your style moodboard</h3>
          <p style={{ color: 'var(--color-muted)', margin: '0 0 24px 0', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            Save looks, colors and aesthetics that feel like you. Then let your wardrobe turn those ideas into real outfits.
          </p>
          <Button style={{ width: 'auto' }} onClick={() => setAddModalOpen(true)}>Add Inspiration</Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
          {inspirations.map(insp => <InspirationCard key={insp._id} inspiration={insp} />)}
        </div>
      )}

      <AddInspirationModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleAdd} loading={adding} />
    </div>
  );
};
export default Inspiration;
