// src/components/auth/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Redirecționează către pagina anterioară (dacă există) sau către Rooms
  const from = location.state?.from?.pathname || '/rooms';
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // 🔥 Redirecționează către pagina dorită
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px 40px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(37, 99, 235, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative wave */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
          borderRadius: '50%',
          opacity: '0.08'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          left: '-40px',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
          borderRadius: '50%',
          opacity: '0.06'
        }}></div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)'
          }}>
            <span style={{ fontSize: '28px', color: 'white' }}>🌊</span>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontFamily: "'Playfair Display', serif",
            color: '#1e293b',
            margin: 0
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '15px' }}>
            Sign in to manage your bookings
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div style={{
            padding: '12px 16px',
            background: '#dcfce7',
            borderRadius: '12px',
            color: '#166534',
            fontSize: '14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>✅</span> {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#fef2f2',
            borderRadius: '12px',
            color: '#dc2626',
            fontSize: '14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '6px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                outline: 'none',
                background: '#f8fafc'
              }}
              placeholder="you@example.com"
              required
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.background = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.background = '#f8fafc';
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '100px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  background: '#f8fafc'
                }}
                placeholder="••••••••"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#64748b',
                  transition: 'color 0.2s ease',
                  borderRadius: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#2563eb';
                  e.target.style.background = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#64748b';
                  e.target.style.background = 'transparent';
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
              opacity: loading ? 0.7 : 1,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#64748b'
        }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{
              color: '#2563eb',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#1e3a8a'}
            onMouseLeave={(e) => e.target.style.color = '#2563eb'}
          >
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;