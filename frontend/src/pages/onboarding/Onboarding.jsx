import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/profileApi';
import { updateStyleProfile } from '../../services/styleApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Check } from 'lucide-react';
import { getApiErrorMessage } from '../../services/api';

const AESTHETICS = [
  { id: 'minimal', name: 'Minimal', desc: 'Clean • Simple • Intentional' },
  { id: 'old money', name: 'Old Money', desc: 'Classic • Refined • Timeless' },
  { id: 'streetwear', name: 'Streetwear', desc: 'Urban • Bold • Casual' },
  { id: 'smart casual', name: 'Smart Casual', desc: 'Polished • Relaxed • Versatile' },
  { id: 'classic', name: 'Classic', desc: 'Traditional • Tailored • Sharp' },
  { id: 'casual', name: 'Casual', desc: 'Easy • Everyday • Relaxed' },
  { id: 'athleisure', name: 'Athleisure', desc: 'Sporty • Active • Comfortable' },
  { id: 'edgy', name: 'Edgy', desc: 'Dark • Rebellious • Statement' },
];

const COLORS = ['Black', 'White', 'Grey', 'Navy', 'Beige', 'Brown', 'Blue', 'Green', 'Red', 'Pink', 'Purple', 'Yellow', 'Orange'];
const FITS = ['Slim', 'Regular', 'Relaxed', 'Oversized', 'Tailored', 'Straight', 'Wide', 'Comfort Fit'];
const GOALS = [
  'Build a better wardrobe', 'Wear what I own more', 'Look more put together', 
  'Discover my personal style', 'Dress better for work', 'Dress better casually', 
  'Experiment more', 'Create outfits faster', 'Reduce unnecessary shopping'
];
const TEMPERATURES = ['cold', 'cool', 'neutral', 'warm', 'hot'];

const Onboarding = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Basic Profile
  const [profile, setProfile] = useState({
    name: user?.name || '',
    location: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  });

  // Step 2-4: Style DNA
  const [styleData, setStyleData] = useState({
    aesthetics: [],
    preferredColors: [],
    preferredFits: [],
    formality: 0.5,
    comfort: 0.8,
    modesty: 0.5,
    temperaturePreference: 'neutral',
    experimentalLevel: 0.5,
    styleGoals: []
  });

  const handleNext = async () => {
    setError('');
    if (step === 1) {
      if (!profile.name) {
        setError('Please enter your name.');
        return;
      }
    }
    
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      await handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setError('');
    try {
      // Format aesthetics
      const formattedAesthetics = styleData.aesthetics.map(a => ({ name: a, score: 0.8 }));
      
      // Calculate formality object
      const f = styleData.formality;
      const formalityObj = {
        casual: f < 0.33 ? 1 : f < 0.66 ? 0.5 : 0,
        smartCasual: f >= 0.33 && f <= 0.66 ? 1 : 0.5,
        formal: f > 0.66 ? 1 : f >= 0.33 ? 0.5 : 0
      };

      const stylePayload = {
        aesthetics: formattedAesthetics,
        preferredColors: styleData.preferredColors.map(c => c.toLowerCase()),
        preferredFits: styleData.preferredFits.map(f => f.toLowerCase()),
        formality: formalityObj,
        comfort: styleData.comfort,
        modesty: styleData.modesty,
        temperaturePreference: styleData.temperaturePreference,
        experimentalLevel: styleData.experimentalLevel,
        styleGoals: styleData.styleGoals
      };

      await updateStyleProfile(stylePayload);
      await updateProfile({ ...profile, onboardingCompleted: true });
      await refreshUser();
      
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (field, item) => {
    setStyleData(prev => {
      const arr = prev[field];
      if (arr.includes(item)) return { ...prev, [field]: arr.filter(i => i !== item) };
      return { ...prev, [field]: [...arr, item] };
    });
  };

  return (
    <div className="onboarding-layout">
      <div className="onboarding-nav">
        <div className="progress-indicator">
          {[1, 2, 3, 4].map(s => (
            <React.Fragment key={s}>
              <div className={`progress-dot ${step >= s ? 'active' : ''}`} />
              {s < 4 && <div className={`progress-line ${step > s ? 'active' : ''}`} style={{ backgroundColor: step > s ? 'var(--color-primary)' : 'var(--color-border)' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="onboarding-content">
        {error && <div className="input-error" style={{ marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        {step === 1 && (
          <div>
            <h1 className="onboarding-title">Welcome to your wardrobe.</h1>
            <p className="onboarding-subtitle">Let's build your personal style profile so your AI stylist can make better recommendations for you.</p>
            
            <Input 
              label="What should we call you?"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
              placeholder="Your name"
            />
            <Input 
              label="Location (Optional for weather)"
              value={profile.location}
              onChange={e => setProfile({...profile, location: e.target.value})}
              placeholder="e.g. New York, NY"
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="onboarding-title">What styles feel like you?</h1>
            <p className="onboarding-subtitle">Select any aesthetics that match your personal style.</p>
            
            <div className="preference-grid">
              {AESTHETICS.map(aes => {
                const isSelected = styleData.aesthetics.includes(aes.id);
                return (
                  <div 
                    key={aes.id} 
                    className={`style-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleArrayItem('aesthetics', aes.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}>{aes.name}</strong>
                      {isSelected && <Check size={16} color="var(--color-primary)" />}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '4px' }}>{aes.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="onboarding-title">Colors, fits & preferences</h1>
            
            <h3 className="section-title">Colors you wear often</h3>
            <div className="preference-grid">
              {COLORS.map(color => (
                <div 
                  key={color} 
                  className={`pref-chip ${styleData.preferredColors.includes(color) ? 'selected' : ''}`}
                  onClick={() => toggleArrayItem('preferredColors', color)}
                >
                  {color}
                </div>
              ))}
            </div>

            <h3 className="section-title">Preferred Fits</h3>
            <div className="preference-grid">
              {FITS.map(fit => (
                <div 
                  key={fit} 
                  className={`pref-chip ${styleData.preferredFits.includes(fit) ? 'selected' : ''}`}
                  onClick={() => toggleArrayItem('preferredFits', fit)}
                >
                  {fit}
                </div>
              ))}
            </div>

            <h3 className="section-title">Formality</h3>
            <div className="slider-container">
              <input type="range" min="0" max="1" step="0.1" className="slider-input" 
                value={styleData.formality} onChange={e => setStyleData({...styleData, formality: parseFloat(e.target.value)})} />
              <div className="slider-labels"><span>Casual</span><span>Smart Casual</span><span>Formal</span></div>
            </div>

            <h3 className="section-title">Comfort</h3>
            <div className="slider-container">
              <input type="range" min="0" max="1" step="0.1" className="slider-input" 
                value={styleData.comfort} onChange={e => setStyleData({...styleData, comfort: parseFloat(e.target.value)})} />
              <div className="slider-labels"><span>Less important</span><span>Very important</span></div>
            </div>

            <h3 className="section-title">Modesty / Coverage</h3>
            <div className="slider-container">
              <input type="range" min="0" max="1" step="0.1" className="slider-input" 
                value={styleData.modesty} onChange={e => setStyleData({...styleData, modesty: parseFloat(e.target.value)})} />
              <div className="slider-labels"><span>More relaxed</span><span>More covered</span></div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="onboarding-title">Goals + Finish</h1>
            
            <h3 className="section-title">How adventurous should your stylist be?</h3>
            <div className="slider-container">
              <input type="range" min="0" max="1" step="0.25" className="slider-input" 
                value={styleData.experimentalLevel} onChange={e => setStyleData({...styleData, experimentalLevel: parseFloat(e.target.value)})} />
              <div className="slider-labels"><span>Familiar</span><span>Balanced</span><span>Surprise me</span></div>
            </div>

            <h3 className="section-title">Primary Climate</h3>
            <div className="preference-grid">
              {TEMPERATURES.map(temp => (
                <div 
                  key={temp} 
                  className={`pref-chip ${styleData.temperaturePreference === temp ? 'selected' : ''}`}
                  onClick={() => setStyleData({...styleData, temperaturePreference: temp})}
                  style={{ textTransform: 'capitalize' }}
                >
                  {temp}
                </div>
              ))}
            </div>

            <h3 className="section-title">What are your style goals?</h3>
            <div className="preference-grid">
              {GOALS.map(goal => (
                <div 
                  key={goal} 
                  className={`pref-chip ${styleData.styleGoals.includes(goal) ? 'selected' : ''}`}
                  onClick={() => toggleArrayItem('styleGoals', goal)}
                >
                  {goal}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="onboarding-footer">
        <div className="onboarding-footer-inner">
          <Button variant="ghost" onClick={step === 1 ? () => navigate('/login') : handleBack} disabled={loading} style={{ width: 'auto' }}>
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button variant="primary" onClick={handleNext} loading={loading} style={{ width: 'auto', paddingLeft: '32px', paddingRight: '32px' }}>
            {step < 4 ? (step === 1 ? "Let's begin" : 'Continue') : 'Create my style profile'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
