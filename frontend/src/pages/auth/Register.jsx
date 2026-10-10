import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/auth/PasswordInput';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.name.length < 2) {
      return setError('Name must be at least 2 characters');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await register({ name: formData.name, email: formData.email, password: formData.password });
      if (res.data.user.onboardingCompleted) {
        navigate('/app/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="Start building your digital wardrobe.">
      <form onSubmit={handleSubmit}>
        <Input 
          label="Name" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
          autoComplete="name"
        />
        <Input 
          label="Email" 
          name="email"
          type="email" 
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          required
          autoComplete="email"
        />
        <PasswordInput 
          label="Password" 
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
          autoComplete="new-password"
        />
        <PasswordInput 
          label="Confirm Password" 
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
          autoComplete="new-password"
        />
        
        {error && <div className="input-error" style={{ marginBottom: '16px', textAlign: 'left' }}>{error}</div>}
        
        <Button type="submit" loading={loading} style={{ marginTop: '8px' }}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
      
      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
