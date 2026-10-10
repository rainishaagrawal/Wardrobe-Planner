import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Shirt, Layers, Calendar, Sparkles, BarChart, Search, Bell, ChevronDown } from 'lucide-react';

const Sidebar = () => (
  <div className="app-sidebar" style={{ backgroundColor: '#FAF9F6', borderRight: '1px solid #F0ECE4' }}>
    <div style={{ marginBottom: '3rem', paddingLeft: '8px' }}>
      <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#222' }}>
        <Sparkles size={22} color="#E4704E" fill="#E4704E" /> Wardrobe AI
      </div>
      <div style={{ fontSize: '0.65rem', color: '#999', marginTop: '2px', paddingLeft: '30px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Style. Smarter.</div>
    </div>
    <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <NavLink to="/app/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active-sidebar' : ''}`}><Home size={18}/> Home</NavLink>
      <NavLink to="/app/wardrobe" className={({isActive}) => `sidebar-link ${isActive ? 'active-sidebar' : ''}`}><Shirt size={18}/> Wardrobe</NavLink>
      <NavLink to="/app/outfits" className={({isActive}) => `sidebar-link ${isActive ? 'active-sidebar' : ''}`}><Layers size={18}/> Outfits</NavLink>
      <NavLink to="/app/planner" className={({isActive}) => `sidebar-link ${isActive ? 'active-sidebar' : ''}`}><Calendar size={18}/> Planner</NavLink>
      <NavLink to="/app/inspiration" className={({isActive}) => `sidebar-link ${isActive ? 'active-sidebar' : ''}`}><Sparkles size={18}/> Inspiration</NavLink>
      <NavLink to="/app/analytics" className={({isActive}) => `sidebar-link ${isActive ? 'active-sidebar' : ''}`}><BarChart size={18}/> Analytics</NavLink>
    </nav>
    <div style={{ 
      marginTop: 'auto', padding: '24px 20px', borderRadius: '16px', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(to bottom, #F5F3FB, #E9E4F5)'
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4A5568', lineHeight: 1.4 }}>Better outfits.<br/>Brighter days.</div>
        <div style={{ width: '24px', height: '2px', background: '#553C9A', marginTop: '16px', borderRadius: '2px' }}></div>
      </div>
    </div>
  </div>
);

const TopNav = () => { const navigate = useNavigate(); const menuRef = React.useRef(); const notifRef = React.useRef(); React.useEffect(() => { const handleClickOutside = (event) => { if (menuRef.current && !menuRef.current.contains(event.target)) setShowProfileMenu(false); if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false); }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []); const { logout } = useAuth(); const [showProfileMenu, setShowProfileMenu] = React.useState(false); const [showNotifications, setShowNotifications] = React.useState(false); return ( <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 40px', gap: '24px', alignItems: 'center', position: 'relative' }}> <button style={{ color: 'var(--color-text)', border: 'none', background: 'transparent', cursor: 'pointer' }}><Search size={20} /></button> <div ref={notifRef} style={{ position: 'relative', zIndex: 9999 }}> <button onClick={() => setShowNotifications(!showNotifications)} style={{ color: 'var(--color-text)', position: 'relative', border: 'none', background: 'transparent', cursor: 'pointer' }}> <Bell size={20} /> <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: 8, height: 8, background: '#F2604C', borderRadius: '50%', border: '2px solid var(--color-bg)' }}></span> </button> {showNotifications && ( <div style={{ position: 'absolute', top: '40px', right: '-20px', background: 'white', border: '1px solid #EAEAEA', borderRadius: '12px', padding: '16px', width: '280px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 100 }}> <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#1A202C' }}>Notifications</h4> <div style={{ fontSize: '0.85rem', color: '#718096', padding: '12px 0', borderBottom: '1px solid #F0F3EF' }}> <strong>New Feature:</strong> AI outfits now prioritize your newest clothes! </div> <div style={{ fontSize: '0.85rem', color: '#718096', padding: '12px 0' }}> <strong>Reminder:</strong> Don't forget to log what you wore today. </div> </div> )} </div> <div ref={menuRef} style={{ position: 'relative', zIndex: 9999 }}> <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}> <img src="https://ui-avatars.com/api/?name=Me&background=F2604C&color=fff" alt="Profile" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} /> <ChevronDown size={16} color="var(--color-text)" /> </div> {showProfileMenu && ( <div style={{ position: 'absolute', top: '48px', right: '0', background: 'white', border: '1px solid #EAEAEA', borderRadius: '12px', padding: '8px', width: '160px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 100 }}> <button onClick={() => { setShowProfileMenu(false); navigate('/app/profile'); }} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '8px', color: '#1A202C' }}>Profile Settings</button> <button onClick={() => { setShowProfileMenu(false); logout(); }} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '8px', color: '#E53E3E' }}>Logout</button> </div> )} </div> </header> ); };

const AppShell = () => (
  <div className="app-layout">
    <Sidebar />
    <main className="app-main">
      <TopNav />
      <Outlet />
    </main>
  </div>
);
export default AppShell;

