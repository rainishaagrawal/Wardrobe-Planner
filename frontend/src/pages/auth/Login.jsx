import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/auth/PasswordInput';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
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
    <AuthLayout title="Welcome back" subtitle="Your wardrobe awaits.">
      <form onSubmit={handleSubmit}>
        <Input 
          label="Email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoComplete="email"
        />
        <PasswordInput 
          label="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
        />
        
        {error && <div className="input-error" style={{ marginBottom: '16px', textAlign: 'left' }}>{error}</div>}
        
        <Button type="submit" loading={loading} style={{ marginTop: '8px' }}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      
      <div className="auth-footer">
        Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
