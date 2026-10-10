import OutfitCard from '../../components/outfit/OutfitCard';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTodayOutfits } from '../../services/outfitApi';
import { getStyleProfile } from '../../services/styleApi';
import { Search, Sparkles, Sun, Briefcase, Heart, Leaf, ArrowRight, Calendar, MoreHorizontal } from 'lucide-react';

const Outfits = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [activeFilter, setActiveFilter] = useState(location.state?.filter || 'All');
  const [outfits, setOutfits] = useState([]);
  const [styleProfile, setStyleProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Recover from sessionStorage on mount if memory cache was wiped by reload
  useEffect(() => { if (location.state && location.state.filter) { setActiveFilter(location.state.filter); setTimeout(() => fetchData(location.state.filter, false), 0); } }, [location.state]); useEffect(() => {
    if (globalOutfitsCache.data.length === 0) {
       const cached = sessionStorage.getItem('cached_outfits_state');
       if (cached) {
         try {
           const parsed = JSON.parse(cached);
           if (parsed.date === new Date().toDateString()) {
             globalOutfitsCache = parsed;
             setOutfits(parsed.data);
           }
         } catch(e) {}
       }
    }
    fetchData(activeFilter !== 'All' ? activeFilter : null, false); 
  }, []);

  const fetchData = async (occasion = null, forceGenerate = false) => {
    setLoading(true);
    try {
      // 1. Check in-memory global cache first!
      const today = new Date().toDateString();
      if (!forceGenerate && globalOutfitsCache.date === today && globalOutfitsCache.data.length > 0) {
        const targetOccasion = occasion || activeFilter;
        // Check if we have outfits for this specific occasion in cache
        const hasOccasion = targetOccasion && targetOccasion !== 'All'
          ? globalOutfitsCache.data.some(o => o.tags && o.tags.some(t => t.toLowerCase() === targetOccasion.toLowerCase()))
          : true;

        if (hasOccasion) {
          setOutfits(globalOutfitsCache.data);
          
          const styleRes = await getStyleProfile();
          if (styleRes.data) setStyleProfile(styleRes.data);
          
          setLoading(false);
          return;
        }
      }

      const { getTodayOutfits } = await import('../../services/outfitApi');
      const params = occasion && occasion !== 'All' ? { occasion: occasion.toLowerCase() } : {};
      const res = await getTodayOutfits(params);
      if (res.data?.outfits) {
        const withTempIds = res.data.outfits.map((o, idx) => ({ 
          ...o, 
          tempId: `temp_${Date.now()}_${idx}`, 
          occasion: occasion && occasion !== 'All' ? occasion : 'casual', 
          tags: [occasion && occasion !== 'All' ? occasion : (o.items && o.items.length > 0 ? (o.items[0].formality || 'Casual') : 'Casual')] 
        }));
        
        if (occasion && occasion !== 'All') {
          setOutfits(prev => {
            const existingIds = new Set(prev.map(p => p.tempId || p._id));
            const newOutfits = withTempIds.filter(o => !existingIds.has(o.tempId || o._id));
            const merged = [...newOutfits, ...prev];
            globalOutfitsCache = { date: today, data: merged };
            sessionStorage.setItem('cached_outfits_state', JSON.stringify(globalOutfitsCache));
            return merged;
          });
        } else {
          setOutfits(withTempIds);
          globalOutfitsCache = { date: today, data: withTempIds };
          sessionStorage.setItem('cached_outfits_state', JSON.stringify(globalOutfitsCache));
        }
      }

      const styleRes = await getStyleProfile();
      if (styleRes.data) {
        setStyleProfile(styleRes.data);
      }
    } catch (error) {
      console.error('Error fetching outfits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOutfitClick = async (outfit) => {
    if (outfit._id) {
      navigate(`/app/outfits/${outfit._id}`);
      return;
    }
    
    // It's a generated outfit without an ID, save it first
    try {
      setSavingId(outfit.tempId);
      const { createOutfit } = await import('../../services/outfitApi');
      const payload = {
        items: outfit.items.map(i => i._id),
        occasion: outfit.occasion || 'casual',
        mood: outfit.mood,
        aesthetic: outfit.aesthetic,
        score: outfit.score,
        scoreBreakdown: outfit.scoreBreakdown
      };
      const res = await createOutfit(payload);
      if (res.data?.data?.outfit?._id || res.data?.outfit?._id) {
        const newId = res.data?.data?.outfit?._id || res.data?.outfit?._id;
        navigate(`/app/outfits/${newId}`);
      } else {
        console.error('Could not get new outfit ID', res.data);
      }
    } catch (error) {
      console.error('Error saving outfit:', error);
      alert('Failed to save outfit. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  const filters = [
    { name: 'All', icon: null },
    { name: 'Casual', icon: Sun },
    { name: 'Office', icon: Briefcase },
    { name: 'Date', icon: Heart },
    { name: 'Comfortable', icon: Leaf },
    { name: 'Minimal', icon: Sparkles }, { name: 'Party', icon: Sparkles }
  ];

  const filteredOutfits = outfits.filter(outfit => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = outfit.name && outfit.name.toLowerCase().includes(q);
      const matchItems = outfit.items && outfit.items.some(i => (i.name && i.name.toLowerCase().includes(q)) || (i.category && i.category.toLowerCase().includes(q)) || (i.primaryColor && i.primaryColor.toLowerCase().includes(q)));
      if (!matchName && !matchItems) return false;
    }
    if (activeFilter === 'All') return true;
    const tags = outfit.tags || (outfit.items && outfit.items.length > 0 ? [outfit.items[0].formality || 'Casual'] : ['Casual']);
    return tags.some(tag => tag.toLowerCase() === activeFilter.toLowerCase());
  });

  return (
    <div style={{ padding: '0 40px 40px 40px', maxWidth: '1600px', margin: '0 auto', width: '100%', position: 'relative', background: '#F8F6F2', minHeight: '100vh' }}>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', paddingTop: '20px' }}>
        
        {/* LEFT COLUMN - MAIN CONTENT */}
        <div style={{ flex: '1 1 65%', display: 'flex', flexDirection: 'column', minWidth: '600px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#A0AEC0', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>OUTFITS</div>
              <h1 style={{ margin: '0 0 12px 0', fontSize: '3.2rem', color: '#1A202C', fontFamily: 'serif' }}>Look good. Feel good.</h1>
              <p style={{ color: '#718096', fontSize: '1.1rem', margin: 0, maxWidth: '500px', lineHeight: 1.5 }}>
                Discover outfit ideas from your wardrobe or get AI suggestions for any occasion.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '100px', padding: '12px 24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #EAEAEA', width: '300px' }}>
              <Search size={18} color="#A0AEC0" />
              <input type="text" placeholder="Search outfits..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', marginLeft: '12px', fontSize: '0.95rem' }} />
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {filters.map(filter => {
              const isActive = activeFilter === filter.name;
              const Icon = filter.icon;
              return (
                <button 
                  key={filter.name}
                  onClick={() => setActiveFilter(filter.name)}
                  style={{ 
                    padding: '10px 24px', 
                    borderRadius: '100px', 
                    border: isActive ? '1px solid #4F6154' : '1px solid #EAEAEA', 
                    background: isActive ? '#4F6154' : 'white',
                    color: isActive ? 'white' : '#4A5568',
                    fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px',
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: isActive ? '0 4px 12px rgba(79, 97, 84, 0.2)' : '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  {Icon && <Icon size={16} />}
                  {filter.name}
                </button>
              );
            })}{filteredOutfits.length > 0 && <button onClick={() => fetchData(activeFilter, true)} style={{ marginLeft: 'auto', background: 'white', color: '#4F6154', border: '1px solid #4F6154', padding: '10px 24px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}><Sparkles size={16} /> Generate More {activeFilter === 'All' ? 'Outfits' : activeFilter}</button>}
          </div>

          {/* Outfit Ideas Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'serif', color: '#1A202C', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#1A202C" /> Outfit Ideas
            </h3>
            <span style={{ fontSize: '0.9rem', color: '#718096', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </span>
          </div>

          {/* Grid */}
          {loading ? (
             <div style={{ padding: '40px', textAlign: 'center', color: '#A0AEC0' }}>Loading outfits...</div>
          ) : filteredOutfits.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {filteredOutfits.map((outfit, index) => (
                <OutfitCard key={outfit._id || outfit.tempId || index} outfit={outfit} loadingId={savingId} onClick={handleOutfitClick} />
              ))}
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
              <Sparkles size={48} color="#CBD5E0" style={{ margin: '0 auto 16px auto' }} />
              <h4 style={{ margin: '0 0 8px 0', color: '#1A202C', fontSize: '1.2rem' }}>No outfits found for {activeFilter}</h4>
              <p style={{ color: '#718096', margin: '0 0 24px 0' }}>We couldn't put together any outfits today. To generate outfits, make sure you have matching Tops and Bottoms (or Dresses) in your wardrobe, and that they are marked as Clean!</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}><button onClick={() => fetchData(activeFilter, true)} style={{ background: '#4F6154', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '100px', cursor: 'pointer' }}>Generate {activeFilter === 'All' ? '' : activeFilter} Outfits</button><button onClick={() => navigate('/app/wardrobe')} style={{ background: activeFilter === 'All' ? '#4F6154' : 'transparent', color: activeFilter === 'All' ? 'white' : '#4F6154', border: activeFilter === 'All' ? 'none' : '1px solid #4F6154', padding: '12px 24px', borderRadius: '100px', cursor: 'pointer' }}>Add Clothes to Wardrobe</button></div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - WIDGETS */}
        <div style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '350px' }}>
          
          {/* Style DNA Widget */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'serif', color: '#1A202C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Your Style DNA <span style={{ color: '#CBD5E0', fontSize: '0.9rem', fontFamily: 'sans-serif' }}>ⓘ</span>
              </h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px' }}>
              {(() => {
                const aesthetics = styleProfile?.profile?.aesthetics || [];
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
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096', lineHeight: 1.5 }}>
                {styleProfile?.profile?.styleGoals?.[0] || styleProfile?.styleDescription || "Timeless pieces, clean looks and effortless style. That's you!"}
              </p>
            </div>
          </div>

          {/* Style Planner Widget */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', backgroundImage: 'url(https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=300)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', opacity: 0.8, mixBlendMode: 'multiply' }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.3rem', fontFamily: 'serif', color: '#1A202C', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={22} color="#1A202C" /> Style Planner
              </h3>
              <p style={{ margin: '0 0 24px 0', color: '#718096', fontSize: '0.95rem' }}>Plan your outfits for the week ahead.</p>
              
              <button style={{ padding: '14px 24px', borderRadius: '100px', background: '#7BA390', border: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', color: 'white', fontSize: '0.95rem' }} onClick={() => navigate('/app/planner')}>
                Plan My Week <ArrowRight size={16} color="white" />
              </button>
            </div>
          </div>

          {/* Quote Widget */}
          <div style={{ background: 'linear-gradient(135deg, #FFF9F2 0%, #F0F4F8 100%)', borderRadius: '24px', padding: '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '140px', height: '140px', backgroundImage: 'url(https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=300)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', opacity: 0.4, mixBlendMode: 'multiply' }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: '0 0 16px 0', color: '#4F6154', fontSize: '1.25rem', fontFamily: 'serif', fontStyle: 'italic', lineHeight: 1.5 }}>
                "Fashion is the armor to survive the reality of everyday life."
              </p>
              <div style={{ width: '30px', height: '2px', background: '#A0AEC0' }}></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Outfits;









