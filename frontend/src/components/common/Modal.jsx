import React, { useEffect } from 'react';
import { X } from 'lucide-react';
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--color-surface)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--color-muted)' }} aria-label="Close"><X size={20} /></button>
        <h2 style={{ marginTop: 0, marginBottom: '24px' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
};
export default Modal;