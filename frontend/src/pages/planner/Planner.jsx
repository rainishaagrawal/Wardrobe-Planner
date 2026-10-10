import React, { useEffect, useState } from 'react';
import { useWeeklyPlan } from '../../hooks/useWeeklyPlan';
import { getWardrobe } from '../../services/wardrobeApi';
import Button from '../../components/common/Button';
import PlannerDayCard from '../../components/planner/PlannerDayCard';
import { Calendar } from 'lucide-react';

const Planner = () => {
  const { plan, loading, error, fetchCurrentPlan, generatePlan, updateDay, regenerateDay, markDayWorn, skipDay } = useWeeklyPlan();
  const [wardrobeEmpty, setWardrobeEmpty] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const wRes = await getWardrobe({ limit: 1 });
        const total = wRes.data?.data?.pagination?.total || wRes.data?.pagination?.total || wRes.data?.items?.length || 0;
        if (total === 0) {
          setWardrobeEmpty(true);
        } else {
          fetchCurrentPlan();
        }
      } catch (err) {
        console.error("Failed to fetch planner context", err);
      }
    };
    init();
  }, [fetchCurrentPlan]);

  const days = plan?.days || [];

  return (
    <div style={{ padding: '20px 40px 40px 40px', maxWidth: '1600px', margin: '0 auto', width: '100%', boxSizing: 'border-box', background: '#F8F6F2', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '3.2rem', color: '#1A202C', fontFamily: 'serif' }}>Your Week, Styled.</h1>
          <p style={{ color: '#718096', margin: 0, fontSize: '1.1rem' }}>A week of outfits built around your wardrobe, your schedule and your style.</p>
        </div>
        {plan && (
          <button 
            onClick={() => generatePlan()}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '100px', background: 'white', 
              border: '1px solid #EAEAEA', color: '#1A202C', fontWeight: 500,
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', fontSize: '0.95rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Refresh Week
          </button>
        )}
      </div>

      {wardrobeEmpty ? (
        <div style={{ background: 'white', borderRadius: '24px', textAlign: 'center', padding: '64px 24px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: '#F8F6F2', marginBottom: '16px' }}>
            <Calendar size={32} color="#1A202C" />
          </div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.5rem', color: '#1A202C' }}>Your week needs a wardrobe first.</h3>
          <p style={{ color: '#718096', margin: '0 0 24px 0', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            Add the clothes you already own and your stylist will build your week around them.
          </p>
          <Button style={{ width: 'auto' }} onClick={() => window.location.href = '/app/wardrobe'}>Add Items</Button>
        </div>
      ) : loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', paddingBottom: '24px' }}>
          {[1,2,3,4].map(i => (
             <div key={i} style={{ height: '500px', background: 'white', borderRadius: '24px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ background: 'white', borderRadius: '24px', color: '#E53E3E', textAlign: 'center', padding: '32px' }}>
          <p style={{ margin: '0 0 16px 0', fontWeight: 500 }}>{error}</p>
          <Button variant="ghost" style={{ width: 'auto', border: '1px solid #E53E3E' }} onClick={() => fetchCurrentPlan()}>Try Again</Button>
        </div>
      ) : !plan ? (
        <div style={{ background: 'white', borderRadius: '24px', textAlign: 'center', padding: '64px 24px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: '#F8F6F2', marginBottom: '16px' }}>
            <Calendar size={32} color="#1A202C" />
          </div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.5rem', color: '#1A202C' }}>Your week isn't planned yet.</h3>
          <p style={{ color: '#718096', margin: '0 0 24px 0', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            Let your AI stylist build seven looks from what you already own. We'll balance your schedule, weather and wardrobe variety.
          </p>
          <Button style={{ width: 'auto' }} onClick={() => generatePlan()}>Plan My Week</Button>
        </div>
      ) : (
        <>
          {/* Banner */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', border: '1px solid #EAEAEA', flexWrap: 'wrap', gap: '16px' }}>
            {/* Left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1A202C', fontWeight: 600, minWidth: '200px' }}>
              <Calendar size={20} color="#4A5568" />
              {new Date(plan.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} &ndash; {new Date(plan.weekEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            
            {/* Middle */}
            <div style={{ flex: 1, minWidth: '250px', maxWidth: '400px', borderLeft: '1px solid #EAEAEA', borderRight: '1px solid #EAEAEA', padding: '0 24px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#718096', letterSpacing: '0.5px', marginBottom: '6px' }}>
                {days.filter(d => d.status === 'worn').length} / 7 DAYS COMPLETED
              </div>
              <div style={{ width: '100%', height: '8px', background: '#F0F0F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(days.filter(d => d.status === 'worn').length / 7) * 100}%`, height: '100%', background: '#9F7AEA', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#48BB78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
              <div style={{ fontSize: '0.85rem', color: '#4A5568', lineHeight: 1.4 }}>
                Good style<br/>builds confidence.
              </div>
            </div>
          </div>

          {/* Grid Container */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '24px', paddingBottom: '32px' }}>
            {days.map((day) => (
              <PlannerDayCard 
                key={day.date} 
                planId={plan._id} 
                day={day} 
                onUpdate={updateDay} 
                onRegenerate={regenerateDay} 
                onMarkWorn={markDayWorn} 
                onSkip={skipDay} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default Planner;
