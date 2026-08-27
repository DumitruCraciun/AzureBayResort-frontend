// src/pages/GuestCheckout.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';

const GuestCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const bookingData = location.state;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {    
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔥 Submit button clicked!');
    console.log('📝 Form data:', formData);
    setError('');

    // Validare
    if (formData.password !== formData.confirmPassword) {
      console.log('❌ Passwords do not match');
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      console.log('❌ Password is too short');
      setError('Password must be at least 6 characters');
      return;
    }

    console.log('✅ Validation passed, calling register...');
    setLoading(true);

    try {
      // 1. Creează contul
      const registerResult = await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone
      });

      console.log('📤 Register result:', registerResult); 

      if (!registerResult.success) {
        setError(registerResult.error || 'Registration failed');
        setLoading(false);
        return;
      }

      console.log('✅ Registration successful!');

      // 2. Creează rezervarea cu user_id
      console.log('📤 Creating booking with data:', {
          room_id: bookingData.roomId,
          check_in_date: bookingData.checkIn,
          check_out_date: bookingData.checkOut,
          guest_count: 1,
          special_requests: ''
      });
      const bookingResponse = await bookingService.create({
        room_id: bookingData.roomId,
        check_in_date: bookingData.checkIn,
        check_out_date: bookingData.checkOut,
        guest_count: 1,
        special_requests: ''
      });

      console.log('📥 Booking created:', bookingResponse.data);

      // 3. Redirecționează către confirmare
      navigate(`/booking-confirmation/${bookingResponse.data.booking.id}`);

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2>No booking data found</h2>
        <Link to="/rooms" style={{ color: '#3b82f6' }}>Back to rooms</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f9fafb' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
        }}>
          <h1 style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", margin: '0 0 8px 0' }}>
            Complete Your Booking
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            You're booking: <strong>{bookingData.roomType}</strong> · £{bookingData.totalPrice} total
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="John Doe"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="you@example.com"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Phone (optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="+44 7123 456789"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    paddingRight: '48px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Min 6 characters"
                />                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    paddingRight: '48px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Confirm your password"
                />              
                  
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ marginBottom: '16px', padding: '12px', background: '#fef2f2', borderRadius: '8px', color: '#dc2626' }}>
                {error}
              </div>
            )}

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
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Creating account...' : 'Confirm Booking & Create Account'}
            </button>

            <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
              Already have an account? <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestCheckout;