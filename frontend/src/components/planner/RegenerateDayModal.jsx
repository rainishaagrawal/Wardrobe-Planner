import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const RegenerateDayModal = ({ isOpen, onClose, day, onSubmit }) => {
  const [occasion, setOccasion] = useState(day?.occasion || 'casual');
  const [mood, setMood] = useState(day?.mood || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ occasion, mood });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!day) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Regenerate Look">
      <form onSubmit={handleSubmit}>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '24px', marginTop: 0 }}>
          Generate a new outfit for {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}. You can update the context below.
        </p>
        <div className="input-group">
          <label className="input-label">Occasion</label>
          <select className="input-field" value={occasion} onChange={e => setOccasion(e.target.value)}>
            <option value="casual">Casual</option>
            <option value="office">Office</option>
            <option value="date">Date</option>
            <option value="party">Party</option>
            <option value="workout">Workout</option>
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Mood (Optional)</label>
          <input className="input-field" type="text" value={mood} onChange={e => setMood(e.target.value)} placeholder="e.g. comfortable, bold" />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Generate New Look</Button>
        </div>
      </form>
    </Modal>
  );
};
export default RegenerateDayModal;
