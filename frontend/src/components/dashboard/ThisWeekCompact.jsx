import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWeeklyPlan } from '../../services/weeklyPlanApi';
import Button from '../common/Button';
import { Check, Circle } from 'lucide-react';

const ThisWeekCompact = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await getCurrentWeeklyPlan();
        const data = res.data?.data?.plan || res.data?.plan || res.data;
        setPlan(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        // ignore 404
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  if (loading) {
    return <div className="dashboard-card" style={{ height: '150px', animation: 'pulse 1.5s infinite' }} />;
  }

  return (
    <div className="dashboard-card">
      <h3 style={{ marginTop: 0, marginBottom: '16px' }}>This Week</h3>
      
      {!plan ? (
        <div>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Your week isn't planned yet.</p>
          <Button variant="ghost" onClick={() => navigate('/app/planner')} style={{ width: '100%', border: '1px solid var(--color-border)' }}>Plan My Week</Button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            {plan.days.map((day, idx) => {
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
              const isWorn = day.status === 'worn';
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: isWorn ? 'var(--color-text)' : 'var(--color-muted)', fontWeight: isWorn ? 600 : 400 }}>{dayName}</span>
                  {isWorn ? <Check size={16} color="green" /> : <Circle size={14} color="var(--color-muted)" opacity={0.3} />}
                </div>
              );
            })}
          </div>
          <Button variant="ghost" onClick={() => navigate('/app/planner')} style={{ width: '100%', border: '1px solid var(--color-border)' }}>View Week</Button>
        </div>
      )}
    </div>
  );
};

export default ThisWeekCompact;
