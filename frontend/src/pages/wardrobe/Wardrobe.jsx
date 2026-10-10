import React, { useState, useEffect } from 'react';
import { getWardrobe } from '../../services/wardrobeApi';
import WardrobeCard from '../../components/wardrobe/WardrobeCard';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Shirt, Scissors, Briefcase, Box, ArrowRight, Calendar, Sparkles } from 'lucide-react';

const Wardrobe = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, byCategory: {} });
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getWardrobe();
      if (res.data?.items) {
        setItems(res.data.items);
        
        // Calculate stats
        const categories = {};
        res.data.items.forEach(i => {
          const cat = i.category ? i.category.toLowerCase() : 'other';
          categories[cat] = (categories[cat] || 0) + 1;
        });
        setStats({ total: res.data.items.length, byCategory: categories });
      }
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'All', icon: null },
    { name: 'Top', icon: Shirt },
    { name: 'Bottom', icon: Scissors },
    { name: 'Outerwear', icon: Box },
    { name: 'Shoes', icon: Box },
    { name: 'Accessories', icon: Briefcase }
  ];

  // Filtering
  const filteredItems = items.filter(item => {
    if (activeFilter === 'All') return true;
    return item.category?.toLowerCase() === activeFilter.toLowerCase() || item.category?.toLowerCase() === activeFilter.toLowerCase() + 's';
  });

  // Calculate percentages for donut
  const total = stats.total || 1; 
  const getPct = (cat) => {
    const key = cat.toLowerCase();
    // Some categories might be stored as 'top' but requested as 'Tops', or 'accessory' vs 'Accessories'
    const count = (
      stats.byCategory[key] || 
      stats.byCategory[key.replace(/s$/, '')] || 
      stats.byCategory[key + 's'] || 
      stats.byCategory[key === 'accessories' ? 'accessory' : key] || 
      0
    );
    return Math.round((count / total) * 100);
  };
  const getCount = (cat) => {
    const key = cat.toLowerCase();
    return (
      stats.byCategory[key] || 
      stats.byCategory[key.replace(/s$/, '')] || 
      stats.byCategory[key + 's'] || 
      stats.byCategory[key === 'accessories' ? 'accessory' : key] || 
      0
    );
  };

  const topsPct = getPct('Top');
  const bottomsPct = getPct('Bottom');
  const outPct = getPct('Outerwear');
  const shoesPct = getPct('Shoes');
  const accPct = getPct('Accessories');
  
  // Create conic gradient stops based on actual pct
  let currentStop = 0;
  const stops = [];
  if (topsPct > 0) { stops.push(`#4F6154 ${currentStop}% ${currentStop + topsPct}%`); currentStop += topsPct; }
  if (bottomsPct > 0) { stops.push(`#7BA390 ${currentStop}% ${currentStop + bottomsPct}%`); currentStop += bottomsPct; }
  if (outPct > 0) { stops.push(`#A9BCA3 ${currentStop}% ${currentStop + outPct}%`); currentStop += outPct; }
  if (shoesPct > 0) { stops.push(`#F08061 ${currentStop}% ${currentStop + shoesPct}%`); currentStop += shoesPct; }
  if (accPct > 0) { stops.push(`#B5A1C4 ${currentStop}% ${currentStop + accPct}%`); currentStop += accPct; }
  
  // Default gray if no items
  const gradientString = stops.length > 0 ? `conic-gradient(${stops.join(', ')})` : 'conic-gradient(#E2E8F0 0% 100%)';

  return (
    <div style={{ padding: '0 40px 40px 40px', maxWidth: '1600px', margin: '0 auto', width: '100%', position: 'relative', background: '#F8F6F2', minHeight: '100vh' }}>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', paddingTop: '20px' }}>
        
        {/* LEFT COLUMN - MAIN WARDROBE CONTENT */}
        <div style={{ flex: '1 1 65%', display: 'flex', flexDirection: 'column', minWidth: '600px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '3.2rem', color: '#1A202C', fontFamily: 'serif' }}>My Wardrobe</h1>
              <p style={{ color: '#718096', fontSize: '1.2rem', margin: 0 }}>{stats.total} items in your closet.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '100px', padding: '12px 24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #EAEAEA', width: '300px' }}>
                <Search size={18} color="#A0AEC0" />
                <input type="text" placeholder="Search your clothes..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', marginLeft: '12px', fontSize: '0.95rem' }} />
              </div>
              
              <button style={{ background: '#4F6154', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }} onClick={() => navigate('/app/wardrobe/add')}>
                <Plus size={18} /> Add Item
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {categories.map(cat => {
              const isActive = activeFilter === cat.name;
              const Icon = cat.icon;
              return (
                <button 
                  key={cat.name}
                  onClick={() => setActiveFilter(cat.name)}
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
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
             <div style={{ padding: '40px', textAlign: 'center', color: '#A0AEC0' }}>Loading your wardrobe...</div>
          ) : filteredItems.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {filteredItems.map(item => (
                <WardrobeCard key={item._id} item={item} onClick={() => navigate('/app/wardrobe/' + item._id)} />
              ))}
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
              <Shirt size={48} color="#CBD5E0" style={{ margin: '0 auto 16px auto' }} />
              <h4 style={{ margin: '0 0 8px 0', color: '#1A202C', fontSize: '1.2rem' }}>No items found</h4>
              <p style={{ color: '#718096', margin: '0 0 24px 0' }}>{activeFilter === 'All' ? "Your wardrobe is empty. Let's add some clothes!" : `You don't have any ${activeFilter} yet.`}</p>
              {activeFilter === 'All' && <button onClick={() => navigate('/app/wardrobe/add')} style={{ background: '#4F6154', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '100px', cursor: 'pointer' }}>+ Add Your First Item</button>}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - WIDGETS */}
        <div style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '350px' }}>
          
          {/* Wardrobe Overview Widget */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 32px 0', fontSize: '1.4rem', fontFamily: 'serif', color: '#1A202C', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shirt size={22} color="#1A202C" /> Wardrobe Overview
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px' }}>
              
              {/* CSS Donut Chart */}
              <div style={{ 
                width: '140px', height: '140px', borderRadius: '50%', 
                background: gradientString,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 600, color: '#1A202C', lineHeight: 1 }}>{stats.total}</span>
                  <span style={{ fontSize: '0.9rem', color: '#718096' }}>Items</span>
                </div>
              </div>

              {/* Legend */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Tops', pct: topsPct + '%', count: getCount('Top'), color: '#4F6154' },
                  { label: 'Bottoms', pct: bottomsPct + '%', count: getCount('Bottom'), color: '#7BA390' },
                  { label: 'Outerwear', pct: outPct + '%', count: getCount('Outerwear'), color: '#A9BCA3' },
                  { label: 'Shoes', pct: shoesPct + '%', count: getCount('Shoes'), color: '#F08061' },
                  { label: 'Accessories', pct: accPct + '%', count: getCount('Accessories'), color: '#B5A1C4' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4A5568', minWidth: '100px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                      {item.label}
                    </div>
                    <span style={{ color: '#718096', flex: 1, textAlign: 'right', paddingRight: '12px' }}>{item.pct}</span>
                    <span style={{ color: '#1A202C', fontWeight: 500 }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#F8F9FA', borderRadius: '16px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Sparkles size={16} color="#718096" style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096', lineHeight: 1.5 }}>
                Keep adding your favorite pieces and build a wardrobe you love!
              </p>
            </div>
          </div>

          {/* This Week Widget */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', backgroundImage: 'url(https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=300)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', opacity: 0.8, mixBlendMode: 'multiply' }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.3rem', fontFamily: 'serif', color: '#1A202C', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={22} color="#1A202C" /> This Week
              </h3>
              <p style={{ margin: '0 0 24px 0', color: '#718096', fontSize: '0.95rem' }}>Your week isn't planned yet.</p>
              
              <button style={{ width: '100%', padding: '16px', borderRadius: '16px', background: '#F0F3EF', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', color: '#1A202C', fontSize: '0.95rem', transition: 'background 0.2s' }} onClick={() => navigate('/app/planner')}>
                Plan My Week <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Wardrobe;
