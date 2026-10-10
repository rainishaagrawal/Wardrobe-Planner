import React, { useEffect, useState } from 'react';
import { getAnalyticsOverview, getWardrobeAnalytics, getOutfitAnalytics, getStyleAnalytics } from '../../services/analyticsApi';
import { Cloud, Shirt, CheckCircle, BarChart2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ overview: null, wardrobe: null, outfits: null, style: null });
  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewRes, wardrobeRes, outfitsRes, styleRes] = await Promise.allSettled([
        getAnalyticsOverview(),
        getWardrobeAnalytics(),
        getOutfitAnalytics(),
        getStyleAnalytics()
      ]);

      setData({
        overview: overviewRes.status === 'fulfilled' ? (overviewRes.value.data?.data || overviewRes.value.data) : null,
        wardrobe: wardrobeRes.status === 'fulfilled' ? (wardrobeRes.value.data?.data || wardrobeRes.value.data) : null,
        outfits: outfitsRes.status === 'fulfilled' ? (outfitsRes.value.data?.data || outfitsRes.value.data) : null,
        style: styleRes.status === 'fulfilled' ? (styleRes.value.data?.data || styleRes.value.data) : null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <h1 style={{ marginBottom: '32px' }}>Analytics</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[1,2,3].map(i => <div key={i} className="dashboard-card" style={{ height: '200px', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      </div>
    );
  }

  const { overview, wardrobe, outfits, style } = data;

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Analytics</h1>
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>Your wardrobe is becoming more intentional.</p>
        </div>
        <Button variant="ghost" style={{ width: 'auto', border: '1px solid var(--color-border)' }} onClick={fetchAnalytics}>Refresh</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* Overview */}
        {overview && (
          <section>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Overview Metrics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="dashboard-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '8px' }}>{overview.totalItems || wardrobe?.totalItems || 0}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: 600 }}>Wardrobe Pieces</div>
              </div>
              <div className="dashboard-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '8px' }}>{overview.utilizationRate || wardrobe?.utilizationRate || '0%'}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: 600 }}>Utilization Rate</div>
              </div>
              <div className="dashboard-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '8px' }}>{overview.outfitsWorn || outfits?.worn || 0}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: 600 }}>Outfits Worn</div>
              </div>
            </div>
          </section>
        )}

        {/* Wardrobe */}
        {wardrobe && (
          <section>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Wardrobe Health</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              
              <div className="dashboard-card" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Category Distribution</h3>
                {wardrobe.categoryDistribution ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {wardrobe.categoryDistribution.map((item) => (
                      <li key={item.category} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ textTransform: 'capitalize' }}>{item.category}</span>
                        <span style={{ fontWeight: 600 }}>{item.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p style={{ color: 'var(--color-muted)', margin: 0 }}>Not enough data.</p>}
              </div>

              <div className="dashboard-card" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Color Distribution</h3>
                {wardrobe.colorDistribution ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {wardrobe.colorDistribution.slice(0,5).map((item) => (
                      <li key={item.color} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ textTransform: 'capitalize' }}>{item.color}</span>
                        <span style={{ fontWeight: 600 }}>{item.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p style={{ color: 'var(--color-muted)', margin: 0 }}>Not enough data.</p>}
              </div>

            </div>
          </section>
        )}

        {/* Outfits */}
        {outfits && (
          <section>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Recommendation Performance</h2>
            <div className="dashboard-card" style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 300 }}>{outfits.generated || 0}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Generated</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 300 }}>{outfits.saved || 0}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Saved</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 300 }}>{outfits.worn || 0}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Worn</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 300 }}>{outfits.liked || 0}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Liked</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Style */}
        {style && (
          <section>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Your Style</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              
              <div className="dashboard-card" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Your stated style</h3>
                <div style={{ color: 'var(--color-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {style.explicitAesthetics && style.explicitAesthetics.length > 0 && <div><strong>Aesthetics:</strong> {style.explicitAesthetics.join(' · ')}</div>}
                  {style.explicitColors && style.explicitColors.length > 0 && <div><strong>Colors:</strong> {style.explicitColors.join(' · ')}</div>}
                  {style.explicitFits && style.explicitFits.length > 0 && <div><strong>Fits:</strong> {style.explicitFits.join(' · ')}</div>}
                </div>
              </div>

              {style.learnedPreferences && Object.keys(style.learnedPreferences).length > 0 && (
                <div className="dashboard-card" style={{ padding: '24px', border: '1px solid var(--color-primary)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>What your behavior suggests</h3>
                  <div style={{ color: 'var(--color-text)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {style.learnedPreferences.aesthetics && <div><strong>Leaning toward:</strong> {style.learnedPreferences.aesthetics.join(' · ')}</div>}
                    {style.learnedPreferences.colors && <div><strong>Favoring colors:</strong> {style.learnedPreferences.colors.join(' · ')}</div>}
                    <p style={{ margin: '8px 0 0 0', fontStyle: 'italic', color: 'var(--color-muted)' }}>Based on outfits you've worn and liked.</p>
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

      </div>
    </div>
  );
};
export default Analytics;
