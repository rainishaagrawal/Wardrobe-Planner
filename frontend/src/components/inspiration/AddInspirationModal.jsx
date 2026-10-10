import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import api from '../../services/api';
import { ImagePlus, Loader2 } from 'lucide-react';

const AddInspirationModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const responseData = res.data?.url ? res.data : (res.data?.data || {});
      
      if (responseData.url) {
        setImageUrl(responseData.url);
        
        // Auto-fill from AI analysis if available
        if (responseData.analysis && !title) {
          const { category, subcategory, aesthetics } = responseData.analysis;
          if (subcategory) {
             const styleStr = aesthetics?.length ? aesthetics[0] : '';
             setTitle(`${styleStr} ${subcategory} look`.trim().replace(/\b\w/g, l => l.toUpperCase()));
          }
          if (aesthetics?.length) {
             setTags(aesthetics.join(', '));
          }
        }
      }
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => uploadFile(e.target.files[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    } else {
      alert("Please drop a valid image file.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    onSubmit({ imageUrl, title, tags: parsedTags, notes, source: 'upload' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Inspiration">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ 
              width: '100%', height: '160px', borderRadius: '8px', 
              background: isDragging ? 'var(--color-surface-hover)' : 'var(--color-surface)', 
              border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              cursor: 'pointer', overflow: 'hidden', position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="Inspiration" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-muted)' }}>
                {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
                <span style={{ fontSize: '0.85rem', marginTop: '8px', textAlign: 'center' }}>
                  {uploading ? 'Analyzing...' : 'Drop image or Click to Upload'}
                </span>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
        </div>
        
        <div className="input-group">
          <label className="input-label">Or Image URL</label>
          <input className="input-field" type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="input-group">
          <label className="input-label">Title</label>
          <input className="input-field" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Minimal Summer Look" />
        </div>
        <div className="input-group">
          <label className="input-label">Tags (comma separated)</label>
          <input className="input-field" type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="minimal, summer, neutral" />
        </div>
        <div className="input-group">
          <label className="input-label">Notes</label>
          <textarea className="input-field" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Inspiration</Button>
        </div>
      </form>
    </Modal>
  );
};
export default AddInspirationModal;
