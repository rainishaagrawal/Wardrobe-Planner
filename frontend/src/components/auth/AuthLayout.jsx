import React from 'react';
import { Sparkles } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-brand">
          <Sparkles size={24} />
          Wardrobe AI
        </div>
        <h1 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
