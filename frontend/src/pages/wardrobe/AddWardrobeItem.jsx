import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWardrobeItem } from '../../services/wardrobeApi';
import { getApiErrorMessage } from '../../services/api';
import WardrobeItemForm from '../../components/wardrobe/WardrobeItemForm';
import { ArrowLeft } from 'lucide-react';

const AddWardrobeItem = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await createWardrobeItem(data);
      navigate('/app/wardrobe');
    } catch (err) {
      setError(getApiErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '0 40px 40px 40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#718096', cursor: 'pointer', fontSize: '0.95rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
        <h1 style={{ margin: '0 0 24px 0', fontSize: '2rem', fontFamily: 'serif', color: '#1A202C' }}>Add New Item</h1>
        
        {error && (
          <div style={{ background: '#FFF5F5', color: '#C53030', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.95rem' }}>
            {error}
          </div>
        )}
        
        <WardrobeItemForm 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/app/wardrobe')}
          loading={submitting}
        />
      </div>
    </div>
  );
};

export default AddWardrobeItem;
