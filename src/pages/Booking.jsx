// src/pages/Booking.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService, roomService, paymentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// 🔥 Încarcă Stripe cu cheia publică
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Fetch booking and room details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        console.log('🔍 [Frontend] Fetching booking ID:', id);

        // Get booking details
        const bookingRes = await bookingService.getById(id);
        console.log('🔍 [Frontend] Booking response:', bookingRes.data);
        const bookingData = bookingRes.data.booking;
        setBooking(bookingData);

        // Get room details
        const roomRes = await roomService.getById(bookingData.room_id);
        console.log('🔍 [Frontend] Room response:', roomRes.data);

        setRoom(roomRes.data.room);
      } catch (err) {
        setError('Failed to load booking details');
        console.error('❌ [Frontend] Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchBooking();
    }
  }, [id, isAuthenticated]);

  // 🔥 HANDLE PAYMENT - Folosește confirmPayment
  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      console.log('💳 Initiating payment for booking:', booking.id);
      
      // 1. Creează Checkout Session
      const paymentRes = await paymentService.createIntent(booking.id);
      console.log('✅ Checkout Session created:', paymentRes.data);
      
      // 2. 🔥 Redirect direct către Stripe Checkout
      window.location.href = paymentRes.data.url;
      
    } catch (err) {
      console.error('❌ Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  
  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancel(booking.id, 'Cancelled by user');
        navigate('/my-bookings');
      } catch (err) {
        console.error('Cancel error:', err);
        setError('Failed to cancel booking.');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626' }}>⚠️ {error || 'Booking not found'}</h2>
        <Link to="/my-bookings" className="hero-btn hero-btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>
          Back to My Bookings
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const days = Math.ceil((new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000 * 60 * 60 * 24));

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f9fafb' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", marginBottom: '8px' }}>
          Complete Your Booking
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Review your booking details and proceed to payment.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Left Column: Booking Summary */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Booking Summary
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Room</div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>{room?.room_type || 'Room'}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Room {room?.room_number}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Check-in</div>
              <div style={{ fontWeight: '600' }}>{formatDate(booking.check_in_date)}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Check-out</div>
              <div style={{ fontWeight: '600' }}>{formatDate(booking.check_out_date)}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Guests</div>
              <div style={{ fontWeight: '600' }}>{booking.guest_count || 1}</div>
            </div>

            {booking.special_requests && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Special Requests</div>
                <div style={{ fontSize: '14px', color: '#374151' }}>{booking.special_requests}</div>
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Total ({days} nights)</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>
                  £{booking.total_price}
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {room?.price_per_night} £/night
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Actions */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              Payment
            </h2>
            
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              Secure payment powered by Stripe
            </p>

            <button
              onClick={handlePayment}
              disabled={processing}
              style={{
                padding: '14px',
                background: 'linear-gradient(135deg, #7253a3, #4237dd)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
                opacity: processing ? 0.7 : 1
              }}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>

            <button
              onClick={handleCancelBooking}
              style={{
                padding: '12px',
                background: 'transparent',
                color: '#dc2626',
                border: '1px solid #dc2626',
                borderRadius: '12px',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Cancel Booking
            </button>

            {error && (
              <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '8px', color: '#dc2626', fontSize: '14px' }}>
                ❌ {error}
              </div>
            )}

            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '8px' }}>
              🔒 Your payment information is secure and encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;