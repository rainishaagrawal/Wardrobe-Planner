import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import NetworkBanner from './components/common/NetworkBanner';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '24px' }}>We couldn't load this part of your wardrobe experience.</p>
          <button onClick={() => window.location.href = '/'} style={{ padding: '12px 24px', background: 'var(--color-primary)', color: 'var(--color-bg)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Go Home</button>
        </div>
      );
    }
    return this.props.children; 
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NetworkBanner />
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
