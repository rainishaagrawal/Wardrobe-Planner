import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, helperText, className = '', id, ...props }, ref) => {
  const inputId = id || Math.random().toString(36).substr(2, 9);
  
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input 
        id={inputId}
        ref={ref}
        className="input-field" 
        style={{ borderColor: error ? 'var(--color-danger)' : undefined }}
        {...props} 
      />
      {error && <span className="input-error">{error}</span>}
      {!error && helperText && <span className="input-error" style={{ color: 'var(--color-muted)' }}>{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
