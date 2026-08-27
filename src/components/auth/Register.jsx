// src/components/auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Șterge eroarea de confirmare când utilizatorul tastează
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Verifică dacă parolele coincid
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Verifică lungimea parolei
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Trimite doar câmpurile necesare pentru register
      const registerData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone
      };
      
      const result = await register(registerData);
      if (result.success) {
        navigate('/rooms');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
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
        {/* Decorative waves */}
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
            Join Azure Bay
          </h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '15px' }}>
            Create your account and start booking
          </p>
        </div>

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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '6px'
            }}>
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
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
              placeholder="John Doe"
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

          <div style={{ marginBottom: '16px' }}>
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
              name="email"
              value={formData.email}
              onChange={handleChange}
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '6px'
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
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
              placeholder="+44 7123 456789"
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

          {/* Password cu toggle show/hide */}
          <div style={{ marginBottom: '16px' }}>
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
                name="password"
                value={formData.password}
                onChange={handleChange}
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
                placeholder="Min 6 characters"
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

          {/* Confirm Password cu toggle show/hide */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '6px'
            }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                placeholder="Confirm your password"
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {/* Indicator vizual pentru confirmare parolă */}
            {formData.confirmPassword && (
              <div style={{
                marginTop: '6px',
                fontSize: '13px',
                color: formData.password === formData.confirmPassword ? '#16a34a' : '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {formData.password === formData.confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
              </div>
            )}
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
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#64748b'
        }}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            style={{
              color: '#2563eb',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#1e3a8a'}
            onMouseLeave={(e) => e.target.style.color = '#2563eb'}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;