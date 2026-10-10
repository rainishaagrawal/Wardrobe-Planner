import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { analyzeWardrobeItem } from '../../services/wardrobeApi';
import { getApiErrorMessage } from '../../services/api';

const AIAnalysisCard = ({ item, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await analyzeWardrobeItem(item._id);
      // The backend returns the updated item in res.data.data.item or res.data.item
      // Let's check typical structure (res.data is the payload if interceptor returns response.data)
      // Usually { success: true, data: { item: {...} } }
      const updatedItem = res.data?.item || res.data; 
      onUpdate(updatedItem);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isAnalyzed = item?.aiAnalysis?.analyzed;
  const confidence = item?.aiAnalysis?.confidence || 0;
  const confPercentage = Math.round(confidence * 100);
  
  let confLabel = 'Low confidence';
  let confColor = 'var(--color-danger)';
  if (confidence >= 0.8) {
    confLabel = 'High confidence';
    confColor = 'green';
  } else if (confidence >= 0.6) {
    confLabel = 'Moderate confidence';
    confColor = '#B06000';
  }

  return (
    <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Sparkles size={20} color="var(--color-primary)" />
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>AI Style Analysis</h2>
      </div>

      {error && (
        <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.9rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 600 }}>We couldn't analyze this item.</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div className="loader-circle" style={{ margin: '0 auto', marginBottom: '16px' }}></div>
          <div style={{ fontWeight: 500 }}>Analyzing your item...</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Identifying category, colors, fit, material and style.</div>
        </div>
      ) : !isAnalyzed ? (
        <div>
          <p style={{ color: 'var(--color-muted)', marginBottom: '24px' }}>
            This item hasn't been analyzed yet.<br/>
            Analyze it to automatically identify its style attributes.
          </p>
          <Button onClick={handleAnalyze} style={{ width: 'auto' }}>Analyze Item</Button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Analyzed Successfully</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                {item.aiAnalysis.analyzedAt ? `Analyzed ${new Date(item.aiAnalysis.analyzedAt).toLocaleDateString()}` : 'Analyzed recently'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, color: confColor }}>{confPercentage}% Confidence</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{confLabel}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div><strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Category</strong><span style={{ textTransform: 'capitalize' }}>{item.category || '-'}</span></div>
            <div><strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Primary Color</strong><span style={{ textTransform: 'capitalize' }}>{item.primaryColor || '-'}</span></div>
            <div><strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Pattern</strong><span style={{ textTransform: 'capitalize' }}>{item.pattern || '-'}</span></div>
            <div><strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Formality</strong><span style={{ textTransform: 'capitalize' }}>{(item.formality || '').replace('smartCasual', 'Smart Casual') || '-'}</span></div>
          </div>

          {item.aesthetics && item.aesthetics.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '8px' }}>Style</strong>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {item.aesthetics.map((aes, i) => (
                  <span key={i} className="pref-chip" style={{ cursor: 'default', padding: '4px 12px', fontSize: '0.8rem' }}>{aes}</span>
                ))}
              </div>
            </div>
          )}

          <Button variant="ghost" onClick={handleAnalyze} style={{ width: 'auto', border: '1px solid var(--color-border)' }}>Analyze Again</Button>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisCard;