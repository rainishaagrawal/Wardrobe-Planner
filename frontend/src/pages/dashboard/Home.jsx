import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getWardrobe } from '../../services/wardrobeApi';
import { getStyleProfile } from '../../services/styleApi';
import { Cloud, MapPin, Sparkles, Shirt, Calendar, Layers, ChevronRight, Sun, Leaf, ArrowRight } from 'lucide-react';
import WardrobeCard from '../../components/wardrobe/WardrobeCard';

const Home = () => {
  const { user, refreshUser } = useAuth(); const [isEditingLocation, setIsEditingLocation] = useState(false); const [newLocation, setNewLocation] = useState(user?.location || ''); const handleUpdateLocation = async (e) => { e.preventDefault(); try { const { default: api } = await import('../../services/api'); await api.put('/profile', { location: newLocation }); await refreshUser(); setIsEditingLocation(false); } catch (err) { console.error(err); } }; useEffect(() => { if (user?.location) setNewLocation(user.location); }, [user]);
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState([]);
  const [styleProfile, setStyleProfile] = useState(null);
  const [recsLoading, setRecsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [weather, setWeather] = useState(null);
  const [greetingTime, setGreetingTime] = useState('morning');
  const [activePill, setActivePill] = useState('Casual');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingTime('morning');
    else if (hour < 18) setGreetingTime('afternoon');
    else setGreetingTime('evening');
    setWeather({ temperature: 22, condition: 'Partly Cloudy' });
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const wardrobeRes = await getWardrobe({ limit: 4, sort: '-createdAt' });
      if (wardrobeRes.data?.items) {
        setRecentItems(wardrobeRes.data.items.slice(0, 4));
      }
      const styleRes = await getStyleProfile();
      if (styleRes.data) {
        setStyleProfile(styleRes.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleQuickContext = async (context) => {
    setActivePill(context);
    setCustomPrompt(context.toLowerCase() + ' look');
  };

  const handleCustomPrompt = async (e) => {
    e.preventDefault();
    setRecsLoading(true);
    setTimeout(() => { setRecsLoading(false); navigate('/app/outfits', { state: { filter: activePill } }); }, 1500);
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div style={{ padding: '0 40px 40px 40px', maxWidth: '1600px', margin: '0 auto', width: '100%', position: 'relative', background: '#F8F6F2', minHeight: '100vh' }}>
      
      {/* Decorative top right shadow/leaf */}
      <div style={{ position: 'absolute', top: '-50px', right: '0', width: '600px', height: '400px', backgroundImage: 'url(https://images.unsplash.com/photo-1502672260266-1c1ff2d3c5ea?auto=format&fit=crop&q=80&w=800)', backgroundRepeat: 'no-repeat', backgroundPosition: 'top right', zIndex: 0, pointerEvents: 'none', opacity: 0.15, mixBlendMode: 'multiply', maskImage: 'radial-gradient(ellipse at top right, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at top right, black 20%, transparent 70%)' }}></div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', position: 'relative', zIndex: 1, paddingTop: '20px' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ flex: '1 1 65%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '600px' }}>
          
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '3.2rem', color: '#1A202C', fontFamily: 'serif' }}>Good {greetingTime}, <span style={{ color: '#4F6154' }}>{firstName}.</span></h1>
            <p style={{ color: '#718096', fontSize: '1.2rem', margin: '0 0 24px 0' }}>Let's style what you already own.</p>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'white', borderRadius: '100px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: '12px 24px', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Sun size={28} color="#F2A65A" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1A202C' }}>22°C <span style={{ color: '#A0AEC0', fontWeight: 400 }}>· Partly Cloudy</span></span>
                  {isEditingLocation ? ( <form onSubmit={handleUpdateLocation} style={{ display: 'flex', gap: '4px', alignItems: 'center', marginTop: '2px' }}> <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} style={{ padding: '2px 4px', fontSize: '0.8rem', border: '1px solid #CBD5E0', borderRadius: '4px', width: '100px' }} autoFocus /> <button type="submit" style={{ background: '#4F6154', color: 'white', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.7rem', cursor: 'pointer' }}>Save</button> </form> ) : ( <span style={{ fontSize: '0.8rem', color: '#A0AEC0', display: 'flex', alignItems: 'center', gap: '6px' }}> <MapPin size={12} /> {user?.location || 'Your Location'} <span onClick={() => setIsEditingLocation(true)} style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: '0.7rem' }}>Change</span> </span> )}
                </div>
              </div>
              <div style={{ width: '1px', height: '32px', background: '#E2E8F0' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px' }}>
                <Leaf size={20} color="#4F6154" />
                <span style={{ fontSize: '0.85rem', color: '#718096', lineHeight: 1.4 }}>Good style isn't about following trends, it's about feeling good in what you wear.</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', background: 'linear-gradient(to right, #F0F3EF 40%, rgba(240, 243, 239, 0) 100%), url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200) no-repeat right center', backgroundSize: 'cover', borderRadius: '24px', padding: '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.02)', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ maxWidth: '450px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#4F6154', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}><Sparkles size={14} /> AI FASHION ASSISTANT</div>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '2.2rem', fontFamily: 'serif', color: '#1A202C', lineHeight: 1.2 }}>What should you wear today?</h2>
              <p style={{ margin: '0 0 24px 0', color: '#4A5568', fontSize: '1.05rem' }}>Tell us your vibe, occasion or let us pick something for you.</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                {['Casual', 'Office', 'Date', 'Comfortable', 'Minimal'].map((ctx) => {
                  const isActive = activePill === ctx;
                  return (
                    <button key={ctx} onClick={() => handleQuickContext(ctx)} disabled={recsLoading} style={{ padding: '10px 20px', borderRadius: '100px', border: isActive ? '1px solid #4F6154' : '1px solid transparent', background: isActive ? '#4F6154' : 'white', color: isActive ? 'white' : '#4A5568', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: isActive ? '0 4px 12px rgba(79, 97, 84, 0.3)' : '0 2px 8px rgba(0,0,0,0.03)' }}>
                      {ctx === 'Casual' && <Sun size={14} />}
                      {ctx === 'Office' && <Calendar size={14} />}
                      {ctx === 'Date' && <Sparkles size={14} />}
                      {ctx === 'Comfortable' && <Leaf size={14} />}
                      {ctx === 'Minimal' && <Sparkles size={14} />}
                      {ctx}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleCustomPrompt} style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '100px', padding: '6px 6px 6px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Sparkles size={18} color="#A0AEC0" />
                <input type="text" placeholder='Type something like: "casual day out", "office look", "weekend fit"...' value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 12px', fontSize: '0.95rem', background: 'transparent' }} disabled={recsLoading} />
                <button type="submit" disabled={recsLoading} style={{ background: '#4F6154', border: 'none', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: 'white' }}>
                  <ArrowRight size={18} color="white" />
                </button>
              </form>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'serif', color: '#1A202C' }}>Recently Added to Your Wardrobe</h3>
              <span style={{ fontSize: '0.9rem', color: '#718096', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => navigate('/app/wardrobe')}>View All <ArrowRight size={14} /></span>
            </div>
            
            {recentItems.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {recentItems.map(item => (
                  <WardrobeCard key={item._id} item={item} onClick={() => navigate(`/app/wardrobe/${item._id}`)} />
                ))}
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
                <Shirt size={40} color="#CBD5E0" style={{ margin: '0 auto 16px auto' }} />
                <h4 style={{ margin: '0 0 8px 0', color: '#1A202C', fontSize: '1.1rem' }}>Your wardrobe is empty</h4>
                <p style={{ color: '#718096', margin: '0 0 24px 0' }}>Add some clothes to see them here.</p>
                <button onClick={() => navigate('/app/wardrobe/add')} style={{ background: '#4F6154', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '100px', cursor: 'pointer' }}>+ Add Your First Item</button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '350px' }}>
          
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'serif', color: '#1A202C', display: 'flex', alignItems: 'center', gap: '8px' }}>Your Style DNA <span style={{ color: '#CBD5E0', fontSize: '0.9rem', fontFamily: 'sans-serif' }}>ⓘ</span></h3>
              <button style={{ fontSize: '0.8rem', padding: '6px 16px', borderRadius: '100px', border: '1px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#4A5568' }} onClick={() => navigate('/app/profile')}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Edit</button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px' }}>
              {(() => {
                const aesthetics = styleProfile?.aesthetics || [];
                const sorted = [...aesthetics].sort((a,b) => b.score - a.score).slice(0, 5);
                const totalScore = sorted.reduce((sum, a) => sum + a.score, 0) || 1;
                
                let gradientStops = [];
                let currentPct = 0;
                const colors = ['#4F6154', '#7BA390', '#A9BCA3', '#F08061', '#B5A1C4'];
                
                sorted.forEach((a, i) => {
                  const pct = (a.score / totalScore) * 100;
                  gradientStops.push(`${colors[i]} ${currentPct}% ${currentPct + pct}%`);
                  currentPct += pct;
                });
                const bg = sorted.length > 0 ? `conic-gradient(${gradientStops.join(', ')})` : 'conic-gradient(#4F6154 0% 32%, #7BA390 32% 60%, #A9BCA3 60% 80%, #F08061 80% 92%, #B5A1C4 92% 100%)';
                
                return (
                  <>
                    <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1A202C', textAlign: 'center', lineHeight: 1.2, textTransform: 'capitalize' }}>
                          {sorted[0]?.name || styleProfile?.primaryArchetype || 'Modern'}<br/>
                          {sorted[1]?.name || styleProfile?.secondaryArchetype || 'Classic'}
                        </span>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {sorted.length > 0 
                        ? sorted.map((a, i) => (
                            <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4A5568' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[i] }}></div>{a.name.charAt(0).toUpperCase() + a.name.slice(1)}</div>
                              <span style={{ color: '#718096' }}>{Math.round((a.score / totalScore) * 100)}%</span>
                            </div>
                          ))
                        : [ { label: 'Minimal', val: '32%', color: '#4F6154' }, { label: 'Classic', val: '28%', color: '#7BA390' }, { label: 'Casual', val: '20%', color: '#A9BCA3' }, { label: 'Elegant', val: '12%', color: '#F08061' }, { label: 'Sporty', val: '8%', color: '#B5A1C4' } ].map(item => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4A5568' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>{item.label}</div>
                              <span style={{ color: '#718096' }}>{item.val}</span>
                            </div>
                          ))
                      }
                    </div>
                  </>
                );
              })()}
            </div>
            <div style={{ background: '#F8F9FA', borderRadius: '16px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Sparkles size={16} color="#718096" style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096', lineHeight: 1.5 }}>{styleProfile?.styleGoals?.[0] || styleProfile?.styleDescription || "Timeless pieces, clean looks and effortless style. That's you!"}</p>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.3rem', fontFamily: 'serif', color: '#1A202C', display: 'flex', alignItems: 'center', gap: '12px' }}><Calendar size={22} color="#1A202C" /> This Week</h3>
            <p style={{ margin: '0 0 24px 0', color: '#718096', fontSize: '0.95rem' }}>Your week isn't planned yet.</p>
            <button style={{ width: '100%', padding: '16px', borderRadius: '16px', background: '#F0F3EF', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', color: '#1A202C', fontSize: '0.95rem', transition: 'background 0.2s' }} onClick={() => navigate('/app/planner')}><Calendar size={18} /> Plan My Week <ArrowRight size={16} /></button>
          </div>

          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', backgroundImage: 'url(https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=300)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', opacity: 0.8, mixBlendMode: 'multiply' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.3rem', fontFamily: 'serif', color: '#1A202C', display: 'flex', alignItems: 'center', gap: '12px' }}><Shirt size={22} color="#1A202C" /> Your Wardrobe</h3>
              <p style={{ margin: '0 0 24px 0', color: '#718096', fontSize: '0.95rem', lineHeight: 1.5, maxWidth: '250px' }}>Manage your clothes, add new items and keep your style organized.</p>
              <button style={{ padding: '14px 24px', borderRadius: '100px', background: '#4F6154', border: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', color: 'white', fontSize: '0.95rem' }} onClick={() => navigate('/app/wardrobe')}>View Wardrobe <ArrowRight size={16} color="white" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

