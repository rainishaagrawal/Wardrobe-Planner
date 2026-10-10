import OutfitCard from '../../components/outfit/OutfitCard';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInspiration, deleteInspiration, analyzeInspiration, generateOutfitFromInspiration } from '../../services/inspirationApi';
import { getApiErrorMessage } from '../../services/api';
import Button from '../../components/common/Button';
import OutfitRecommendationCard from '../../components/dashboard/OutfitRecommendationCard';
import { ArrowLeft, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react';

const InspirationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspiration, setInspiration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState('');
  const [outfitMatches, setOutfitMatches] = useState([]);
  
  const [matchOccasion, setMatchOccasion] = useState('casual');

  useEffect(() => {
    fetchInspiration();
  }, [id]);

  const fetchInspiration = async () => {
    try {
      const res = await getInspiration(id);
      const data = res.data?.data?.inspiration || res.data?.inspiration || res.data;
      setInspiration(data);
    } catch (err) {
      setError(getApiErrorMessage(err) || 'Inspiration not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this inspiration? Your existing outfits will not be deleted.")) return;
    setDeleting(true);
    try {
      await deleteInspiration(id);
      navigate('/app/inspiration');
    } catch (err) {
      alert("Failed to delete inspiration.");
      setDeleting(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await analyzeInspiration(id);
      const updated = res.data?.data?.inspiration || res.data?.inspiration || res.data;
      setInspiration(updated);
    } catch (err) {
      alert("We couldn't analyze this inspiration. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStyleThisLook = async (e) => {
    e.preventDefault();
    setMatching(true); setMatchError('');
    try {
      const res = await generateOutfitFromInspiration({ inspirationId: id, occasion: matchOccasion });
      const newOutfits = res.data?.data?.outfits || res.data?.outfits || res.data || [];
      setOutfitMatches(Array.isArray(newOutfits) ? newOutfits : [newOutfits]);
    } catch (err) {
      setMatchError(getApiErrorMessage(err) || "Not enough wardrobe pieces yet. Add more items to unlock better matches.");
    } finally {
      setMatching(false);
    }
  };

  if (loading) return <div className="app-container"><div className="loader-circle" /></div>;
  if (error || !inspiration) return <div className="app-container" style={{color: 'var(--color-danger)'}}>{error}</div>;

  const analysis = inspiration.analysis;

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px' }}>
        <Button variant="ghost" style={{ width: 'auto', padding: 0 }} onClick={() => navigate('/app/inspiration')}><ArrowLeft size={16} style={{marginRight:'8px'}}/> Back to Inspiration</Button>
        <Button variant="ghost" style={{ width: 'auto', padding: 0, color: 'var(--color-danger)' }} onClick={handleDelete} disabled={deleting}><Trash2 size={16} /></Button>
      </div>
      
      <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
        
        {/* Main Image */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ width: '100%', aspectRatio: '3/4', background: '#F8F7F4', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {inspiration.imageUrl ? (
              <img src={inspiration.imageUrl} alt={inspiration.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <ImageIcon size={48} color="var(--color-muted)" opacity={0.5} />
            )}
          </div>
        </div>

        {/* Metadata & Actions */}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>{inspiration.title || 'Saved Inspiration'}</h1>
            {inspiration.tags && inspiration.tags.length > 0 && (
              <div style={{ color: 'var(--color-muted)', marginBottom: '16px' }}>{inspiration.tags.map(t => `#${t}`).join(' ')}</div>
            )}
            {inspiration.notes && <p style={{ fontSize: '0.95rem' }}>{inspiration.notes}</p>}
          </div>

          <div className="dashboard-card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={18} /> AI Style Analysis</h3>
            
            {!analysis ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Let AI understand its colors, garments and aesthetic.</p>
                <Button onClick={handleAnalyze} loading={analyzing}>Analyze this inspiration</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
                {analysis.styleDescription && <div style={{ fontStyle: 'italic', color: 'var(--color-text)', borderLeft: '3px solid var(--color-primary)', paddingLeft: '12px' }}>{analysis.styleDescription}</div>}
                {analysis.colors && <div><strong>Colors:</strong> <span style={{ textTransform: 'capitalize' }}>{analysis.colors.join(' · ')}</span></div>}
                {analysis.garments && <div><strong>Garments:</strong> <span style={{ textTransform: 'capitalize' }}>{analysis.garments.join(' · ')}</span></div>}
                {analysis.aesthetics && <div><strong>Aesthetic:</strong> <span style={{ textTransform: 'capitalize' }}>{analysis.aesthetics.join(' · ')}</span></div>}
                {analysis.confidence && <div><strong>Confidence:</strong> {Math.round(analysis.confidence * 100)}% Match</div>}
              </div>
            )}
          </div>

          <div className="dashboard-card" style={{ padding: '24px', border: '1px solid var(--color-primary)' }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Style This Look</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              We'll match its aesthetic, colors and overall feel using pieces you already own in your wardrobe.
            </p>
            <form onSubmit={handleStyleThisLook}>
              <div className="input-group">
                <label className="input-label">Occasion</label>
                <select className="input-field" value={matchOccasion} onChange={e => setMatchOccasion(e.target.value)} disabled={matching}>
                  <option value="casual">Casual</option>
                  <option value="office">Office</option>
                  <option value="date">Date Night</option>
                  <option value="party">Party</option>
                  <option value="workout">Workout</option>
                </select>
              </div>
              <Button type="submit" loading={matching} disabled={matching}>Generate Matches</Button>
            </form>
          </div>
          
        </div>
      </div>
      
      {/* Generated Outfit Results */}
      {(outfitMatches.length > 0 || matchError) && (
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--color-border)' }}>
          <h2 style={{ marginBottom: '24px' }}>Inspired by your saved look</h2>
          {matchError ? (
            <div className="dashboard-card" style={{ color: 'var(--color-danger)', textAlign: 'center' }}>{matchError}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {outfitMatches.map((outfit, idx) => (
                <OutfitCard key={outfit._id || idx} outfit={outfit} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
export default InspirationDetails;


