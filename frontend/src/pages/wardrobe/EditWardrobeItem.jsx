import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWardrobeItem, updateWardrobeItem } from '../../services/wardrobeApi';
import { getApiErrorMessage } from '../../services/api';
import WardrobeItemForm from '../../components/wardrobe/WardrobeItemForm';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

const EditWardrobeItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try { const res = await getWardrobeItem(id); setItem(res.data.item); } 
      catch (err) { setError(getApiErrorMessage(err)); } 
      finally { setLoading(false); }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (data) => {
    setSubmitting(true); setError('');
    try { await updateWardrobeItem(id, data); navigate(`/app/wardrobe/${id}`); } 
    catch (err) { setError(getApiErrorMessage(err)); setSubmitting(false); }
  };

  if (loading) return <div className="app-container">Loading...</div>;
  if (!item) return <div className="app-container">Item not found</div>;

  return (
    <div className="app-container" style={{ maxWidth: '600px' }}>
      <Button variant="ghost" style={{ width: 'auto', padding: '0 0 24px 0' }} onClick={() => navigate(`/app/wardrobe/${id}`)}><ArrowLeft size={16} /> Back to Details</Button>
      <h1 style={{ marginBottom: '24px' }}>Edit Item</h1>
      {error && <div className="input-error" style={{ marginBottom: '16px' }}>{error}</div>}
      <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <WardrobeItemForm initialData={item} onSubmit={handleSubmit} onCancel={() => navigate(`/app/wardrobe/${id}`)} loading={submitting} />
      </div>
    </div>
  );
};
export default EditWardrobeItem;