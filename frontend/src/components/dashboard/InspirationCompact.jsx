import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInspirations } from '../../services/inspirationApi';
import Button from '../common/Button';

const InspirationCompact = () => {
  const navigate = useNavigate();
  const [inspirations, setInspirations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsp = async () => {
      try {
        const res = await getInspirations({ limit: 3 });
        const data = res.data?.data?.inspirations || res.data?.inspirations || res.data || [];
        setInspirations(Array.isArray(data) ? data : []);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchInsp();
  }, []);

  if (loading || inspirations.length === 0) return null;

  return (
    <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Inspired by you</h3>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {inspirations.map(insp => (
          <div key={insp._id} style={{ flex: 1, aspectRatio: '3/4', background: '#F8F7F4', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => navigate(`/app/inspiration/${insp._id}`)}>
            {insp.imageUrl && <img src={insp.imageUrl} alt="insp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
        ))}
      </div>
      <Button variant="ghost" onClick={() => navigate('/app/inspiration')} style={{ width: '100%', border: '1px solid var(--color-border)' }}>View Moodboard &rarr;</Button>
    </div>
  );
};

export default InspirationCompact;
