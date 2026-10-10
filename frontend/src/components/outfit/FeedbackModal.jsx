import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const FeedbackModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [comment, setComment] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What didn't feel right?">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {['Too formal', 'Too casual', 'Colors', 'Fit', 'Not my style', 'Weather mismatch'].map(tag => (
            <button 
              type="button"
              key={tag} 
              className="pref-chip" 
              onClick={() => setComment(prev => prev ? `${prev}, ${tag}` : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        
        <label className="input-label">Optional note...</label>
        <textarea 
          value={comment}
          onChange={e => setComment(e.target.value)}
          maxLength={500}
          rows={3}
          style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical' }}
        />
        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '4px', marginBottom: '24px' }}>
          {comment.length} / 500
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={loading}>Submit Feedback</Button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackModal;
