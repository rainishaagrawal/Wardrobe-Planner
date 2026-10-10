import React, { useState, useRef } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { CATEGORIES, COLORS, FORMALITIES, PATTERNS } from '../../utils/constants';
import api from '../../services/api';
import { ImagePlus, Loader2 } from 'lucide-react';

const WardrobeItemForm = ({ initialData = {}, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    category: initialData.category || 'top',
    primaryColor: initialData.primaryColor || '',
    formality: initialData.formality || 'casual',
    pattern: initialData.pattern || 'solid',
    imageUrl: initialData.imageUrl || ''
  });
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
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
        setFormData(prev => {
          const updates = { imageUrl: responseData.url };
          // Auto-fill from AI analysis if available
          if (responseData.analysis) {
            const { category, primaryColor, pattern, formality, subcategory } = responseData.analysis;
            
            // Generate a smart name if not set
            if (!prev.name && subcategory && primaryColor) {
              updates.name = `${primaryColor} ${subcategory}`.replace(/\b\w/g, l => l.toUpperCase());
            }

            if (category && CATEGORIES.includes(category)) updates.category = category;
            if (primaryColor && COLORS.includes(primaryColor)) updates.primaryColor = primaryColor;
            if (pattern && PATTERNS.includes(pattern)) updates.pattern = pattern;
            if (formality && FORMALITIES.includes(formality)) updates.formality = formality;
          }
          return { ...prev, ...updates };
        });
      }
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    uploadFile(e.target.files[0]);
  };

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

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ 
            width: '120px', height: '120px', borderRadius: '8px', 
            background: isDragging ? 'var(--color-surface-hover)' : 'var(--color-surface)', 
            border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            cursor: 'pointer', overflow: 'hidden', position: 'relative',
            transition: 'all 0.2s ease'
          }}
        >
          {formData.imageUrl ? (
            <img src={formData.imageUrl} alt="Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-muted)' }}>
              {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
              <span style={{ fontSize: '0.75rem', marginTop: '8px', textAlign: 'center' }}>
                {uploading ? 'Analyzing...' : 'Drop image or Click'}
              </span>
            </div>
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
      </div>

      <Input label="Name *" name="name" value={formData.name} onChange={handleChange} required />
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}><label className="input-label">Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }} required>
            <option value="">Select...</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select></div>
        <div style={{ flex: 1 }}><label className="input-label">Primary Color *</label>
          <select name="primaryColor" value={formData.primaryColor} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }} required>
            <option value="">Select...</option>{COLORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select></div>
      </div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}><label className="input-label">Formality</label>
          <select name="formality" value={formData.formality} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
            {FORMALITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select></div>
        <div style={{ flex: 1 }}><label className="input-label">Pattern</label>
          <select name="pattern" value={formData.pattern} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
            <option value="">Select...</option>{PATTERNS.map(c => <option key={c} value={c}>{c}</option>)}
          </select></div>
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" loading={loading || uploading}>Save Item</Button>
      </div>
    </form>
  );
};
export default WardrobeItemForm;