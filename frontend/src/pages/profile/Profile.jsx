import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/profileApi';
import { getStyleProfile, updateStyleProfile, addTemporaryPreference, removeTemporaryPreference } from '../../services/styleApi';
import { getApiErrorMessage } from '../../services/api';
import Button from '../../components/common/Button';
import { User, Shield, Target, Plus, Trash2 } from 'lucide-react';

const Profile = () => {
  const { logout } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [styleProfile, setStyleProfile] = useState(null);
  const [tempPrefs, setTempPrefs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingStyle, setSavingStyle] = useState(false);
  
  // Personal Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [timezone, setTimezone] = useState('');

  // Style Form State (Safe subset)
  const [aesthetics, setAesthetics] = useState([]);
  const [colors, setColors] = useState([]);
  
  // Temp Pref State
  const [tempContext, setTempContext] = useState('');
  const [tempTheme, setTempTheme] = useState('');
  const [tempDays, setTempDays] = useState(7);
  const [savingTemp, setSavingTemp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, styleRes] = await Promise.all([
          getProfile(),
          getStyleProfile()
        ]);
        
        const pData = profRes.data?.data?.user || profRes.data?.user || profRes.data;
        setProfile(pData);
        setName(pData?.name || '');
        setLocation(pData?.location || '');
        setTimezone(pData?.timezone || '');

        const sData = styleRes.data?.data || styleRes.data;
        setStyleProfile(sData);
        setAesthetics(sData?.aesthetics || []);
        setColors(sData?.preferredColors || []);
        
        // Mocking temp prefs extraction if they exist on style profile
        setTempPrefs(sData?.temporaryPreferences || []);
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    if (name.length < 2) return alert("Name must be at least 2 characters.");
    setSavingPersonal(true);
    try {
      await updateProfile({ name, location, timezone });
      alert("Personal information updated.");
    } catch (err) {
      alert(getApiErrorMessage(err) || "Failed to update profile.");
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleStyleSubmit = async (e) => {
    e.preventDefault();
    setSavingStyle(true);
    try {
      // Only send explicitly editable fields to preserve learnedPreferences
      await updateStyleProfile({ aesthetics, preferredColors: colors });
      alert("Style DNA updated.");
    } catch (err) {
      alert(getApiErrorMessage(err) || "Failed to update style.");
    } finally {
      setSavingStyle(false);
    }
  };

  const handleAddTempPref = async (e) => {
    e.preventDefault();
    if (!tempContext) return;
    setSavingTemp(true);
    try {
      const res = await addTemporaryPreference({ context: tempContext, theme: tempTheme, durationDays: tempDays });
      const newPref = res.data?.data?.preference || res.data?.preference || res.data;
      if (newPref) setTempPrefs(prev => [...prev, newPref]);
      setTempContext(''); setTempTheme('');
    } catch (err) {
      alert(getApiErrorMessage(err) || "Failed to add temporary preference.");
    } finally {
      setSavingTemp(false);
    }
  };

  const handleDeleteTempPref = async (id) => {
    try {
      await removeTemporaryPreference(id);
      setTempPrefs(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert("Failed to delete preference.");
    }
  };

  if (loading) return <div className="app-container"><div className="loader-circle" /></div>;

  return (
    <div className="app-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '8px' }}>Profile</h1>
      <p style={{ color: 'var(--color-muted)', margin: '0 0 40px 0' }}>Your personal style space.</p>

      {/* Personal Info */}
      <section className="dashboard-card" style={{ marginBottom: '32px', padding: '32px' }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18}/> Personal Information</h2>
        <form onSubmit={handlePersonalSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input className="input-field" type="email" value={profile?.email || ''} disabled style={{ background: 'var(--color-bg)', opacity: 0.7 }} />
          </div>
          <div className="input-group">
            <label className="input-label">Name</label>
            <input className="input-field" type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Location</label>
              <input className="input-field" type="text" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Timezone</label>
              <input className="input-field" type="text" value={timezone} onChange={e => setTimezone(e.target.value)} />
            </div>
          </div>
          <Button type="submit" loading={savingPersonal} style={{ width: 'auto', marginTop: '16px' }}>Save Changes</Button>
        </form>
      </section>

      {/* Style DNA */}
      <section className="dashboard-card" style={{ marginBottom: '32px', padding: '32px' }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={18}/> Style DNA</h2>
        <form onSubmit={handleStyleSubmit}>
          <div className="input-group">
            <label className="input-label">Aesthetics (comma separated)</label>
            <input className="input-field" type="text" value={aesthetics.join(', ')} onChange={e => setAesthetics(e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
          </div>
          <div className="input-group">
            <label className="input-label">Preferred Colors (comma separated)</label>
            <input className="input-field" type="text" value={colors.join(', ')} onChange={e => setColors(e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontStyle: 'italic', marginBottom: '24px' }}>
            Note: Your AI stylist also actively learns your preferences based on the outfits you wear and save. Those learned preferences are preserved securely behind the scenes.
          </p>
          <Button type="submit" loading={savingStyle} style={{ width: 'auto' }}>Update Style DNA</Button>
        </form>
      </section>

      {/* Temporary Preferences */}
      <section className="dashboard-card" style={{ marginBottom: '32px', padding: '32px' }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18}/> Temporary Preferences</h2>
        
        {tempPrefs.length > 0 && (
          <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tempPrefs.map((pref, i) => (
              <div key={pref._id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{pref.context}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{pref.theme} &middot; Expires soon</div>
                </div>
                <button type="button" onClick={() => handleDeleteTempPref(pref._id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddTempPref} style={{ padding: '24px', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Add Temporary Preference</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: '1 1 200px' }}>
              <label className="input-label">Context (e.g. Rainy week)</label>
              <input className="input-field" type="text" value={tempContext} onChange={e => setTempContext(e.target.value)} required />
            </div>
            <div className="input-group" style={{ flex: '1 1 200px' }}>
              <label className="input-label">Theme (e.g. Waterproof)</label>
              <input className="input-field" type="text" value={tempTheme} onChange={e => setTempTheme(e.target.value)} />
            </div>
            <div className="input-group" style={{ flex: '0 1 100px' }}>
              <label className="input-label">Days</label>
              <input className="input-field" type="number" min="1" max="30" value={tempDays} onChange={e => setTempDays(e.target.value)} />
            </div>
          </div>
          <Button variant="ghost" type="submit" loading={savingTemp} style={{ width: 'auto', border: '1px solid var(--color-border)', marginTop: '8px' }}>
            <Plus size={16} style={{marginRight: '8px'}}/> Add Preference
          </Button>
        </form>
      </section>

      {/* Account */}
      <section className="dashboard-card" style={{ padding: '32px' }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '1.2rem' }}>Account</h2>
        <Button variant="ghost" onClick={logout} style={{ width: 'auto', color: 'var(--color-danger)', border: '1px solid var(--color-danger)' }}>Log out</Button>
      </section>

    </div>
  );
};
export default Profile;
