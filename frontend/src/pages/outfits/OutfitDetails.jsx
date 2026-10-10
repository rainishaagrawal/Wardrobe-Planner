import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOutfit, saveOutfit, markOutfitWorn } from '../../services/outfitApi';
import { useOutfitFeedback } from '../../hooks/useOutfitFeedback';
import { getApiErrorMessage } from '../../services/api';
import Button from '../../components/common/Button';
import FeedbackModal from '../../components/outfit/FeedbackModal';
import { ArrowLeft, Bookmark, Check, ThumbsUp, ThumbsDown, AlertCircle, Cloud } from 'lucide-react';

const OutfitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [actionLoading, setActionLoading] = useState(false);
  const [dislikeModalOpen, setDislikeModalOpen] = useState(false);
  
  // Custom hook handles feedback state & API
  const { feedback, loading: feedbackLoading, error: feedbackError, successMsg: feedbackSuccess, submitFeedback, setFeedback } = useOutfitFeedback(id);

  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        const res = await getOutfit(id);
        const data = res.data?.data?.outfit || res.data?.outfit || res.data;
        setOutfit(data);
        
        // If the backend returns feedback inside the outfit object
        if (data.feedback) setFeedback(data.feedback);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchOutfit();
  }, [id, setFeedback]);

  const handleSave = async () => {
    if (outfit.savedAt) return;
    setActionLoading(true);
    try {
      await saveOutfit(id);
      setOutfit(prev => ({ ...prev, savedAt: new Date().toISOString(), status: 'saved' }));
    } catch (err) {
      alert("Couldn't save this outfit.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleWear = async () => {
    if (outfit.wornAt) return;
    setActionLoading(true);
    try {
      await markOutfitWorn(id);
      setOutfit(prev => ({ ...prev, wornAt: new Date().toISOString(), status: 'worn' }));
    } catch (err) {
      alert("Couldn't mark this outfit as worn.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLike = () => submitFeedback('like');
  const handleSkip = () => submitFeedback('skip');
  
  const handleDislikeSubmit = async (comment) => {
    await submitFeedback('dislike', comment);
    setDislikeModalOpen(false);
  };

  if (loading) return <div className="app-container"><div className="loader-circle" /></div>;
  if (error || !outfit) return <div className="app-container" style={{color: 'var(--color-danger)'}}>{error || 'Outfit not found'}</div>;

  const items = outfit.items || [];
  const reasons = outfit.reasons || [];
  const rating = feedback?.rating;

  return (
    <div className="app-container">
      <Button variant="ghost" style={{ width: 'auto', padding: '0 0 24px 0' }} onClick={() => navigate('/app/outfits')}><ArrowLeft size={16} /> Back</Button>
      
      <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
        
        {/* Main Outfit Visual Area */}
        <div style={{ flex: '1 1 400px' }}>
          <div>
            <h1 style={{ marginBottom: '8px' }}>Today's Look</h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '32px', color: 'var(--color-muted)' }}>
              {outfit.aesthetics?.[0] && <span style={{ textTransform: 'capitalize' }}>{outfit.aesthetics[0]}</span>}
              {outfit.formality && <span>&middot;</span>}
              {outfit.formality && <span style={{ textTransform: 'capitalize' }}>{outfit.formality.replace('smartCasual', 'Smart Casual')}</span>}
              {outfit.weatherSnapshot && <span>&middot;</span>}
              {outfit.weatherSnapshot && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Cloud size={14}/> 28°C</span>}
            </div>
          </div>
          
          <div style={{ background: '#F8F7F4', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-muted)' }}>Outfit Pieces</h3>
            {items.map((itemObj, idx) => {
              const item = itemObj.item || itemObj;
              return (
                <div key={item._id || idx} onClick={() => item._id && navigate(`/app/wardrobe/${item._id}`)} style={{ display: 'flex', gap: '16px', alignItems: 'center', cursor: item._id ? 'pointer' : 'default', background: 'var(--color-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', transition: 'transform 0.2s' }} className="hover-lift">
                  <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', background: '#F0EFEA', overflow: 'hidden', flexShrink: 0 }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}><Cloud size={24} color="var(--color-muted)"/></div>}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{item.name || 'Unknown item'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'capitalize' }}>{item.category} {item.primaryColor && `· ${item.primaryColor}`}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Information & Action Panel */}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {reasons.length > 0 && (
            <div>
              <h3 style={{ margin: '0 0 16px 0' }}>Why this works</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px', display: 'flex', gap: '16px' }}>
            <Button 
              variant={outfit.savedAt ? 'ghost' : 'primary'} 
              style={{ flex: 1, border: outfit.savedAt ? '1px solid var(--color-border)' : 'none' }}
              onClick={handleSave} 
              disabled={actionLoading || outfit.savedAt}
            >
              <Bookmark size={18} style={{ marginRight: '8px' }}/> {outfit.savedAt ? 'Saved' : 'Save Outfit'}
            </Button>
            
            <Button 
              variant={outfit.wornAt ? 'ghost' : 'primary'} 
              style={{ flex: 1, border: outfit.wornAt ? '1px solid var(--color-border)' : 'none' }}
              onClick={handleWear} 
              disabled={actionLoading || outfit.wornAt}
            >
              <Check size={18} style={{ marginRight: '8px' }}/> {outfit.wornAt ? 'Worn today' : 'Mark Worn'}
            </Button>
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '24px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>How does it feel?</h3>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <Button variant="ghost" style={{ flex: 1, background: rating === 'like' ? 'rgba(0,0,0,0.05)' : 'transparent', border: rating === 'like' ? '1px solid var(--color-text)' : '1px solid var(--color-border)' }} onClick={handleLike} disabled={feedbackLoading}>
                <ThumbsUp size={18} style={{ marginRight: '8px' }}/> Like
              </Button>
              <Button variant="ghost" style={{ flex: 1, background: rating === 'dislike' ? 'rgba(0,0,0,0.05)' : 'transparent', border: rating === 'dislike' ? '1px solid var(--color-text)' : '1px solid var(--color-border)' }} onClick={() => rating !== 'dislike' ? setDislikeModalOpen(true) : null} disabled={feedbackLoading}>
                <ThumbsDown size={18} style={{ marginRight: '8px' }}/> Dislike
              </Button>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Button variant="ghost" style={{ width: 'auto', padding: '4px 12px', fontSize: '0.85rem', color: 'var(--color-muted)' }} onClick={handleSkip} disabled={feedbackLoading || rating === 'skip'}>
                Not today (Skip)
              </Button>
            </div>

            {feedbackError && <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}><AlertCircle size={14}/> {feedbackError}</div>}
            {feedbackSuccess && <div style={{ color: 'green', fontSize: '0.85rem', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}><Check size={14}/> {feedbackSuccess}</div>}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
            <div style={{ marginBottom: '4px' }}><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{outfit.status || 'Suggested'}</span></div>
            <div><strong>Generated:</strong> {new Date(outfit.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

      </div>

      <FeedbackModal isOpen={dislikeModalOpen} onClose={() => setDislikeModalOpen(false)} onSubmit={handleDislikeSubmit} loading={feedbackLoading} />
    </div>
  );
};

export default OutfitDetails;
