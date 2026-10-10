import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', loading = false, disabled = false, className = '', ...props }) => {
  const baseClass = 'btn';
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
  const combinedClass = `${baseClass} ${variantClass} ${className}`;

  return (
    <button 
      className={combinedClass} 
      disabled={loading || disabled} 
      {...props}
    >
      {loading && <Loader2 className="spinner" size={18} />}
      {!loading && children}
    </button>
  );
};

export default Button;
