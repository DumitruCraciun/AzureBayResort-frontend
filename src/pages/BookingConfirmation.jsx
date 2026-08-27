// src/pages/BookingConfirmation.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingConfirmation = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Verifică dacă plata a fost succesfulă
  const success = searchParams.get('success') === 'true';
  const sessionId = searchParams.get('session_id');
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching booking:', id);
        
        const response = await bookingService.getById(id);
        console.log('✅ Booking fetched:', response.data);
        setBooking(response.data.booking);
        
        // Dacă avem session_id, verifică statusul plății
        if (sessionId) {
          try {
            const statusRes = await bookingService.checkPaymentStatus(sessionId);
            setPaymentStatus(statusRes.data);
          } catch (err) {
            console.warn('Could not fetch payment status:', err);
          }
        }
      } catch (err) {
        setError('Failed to load booking details');
        console.error('❌ Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBooking();
    }
  }, [id, sessionId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626' }}>⚠️ {error || 'Booking not found'}</h2>
        <Link to="/rooms" className="hero-btn hero-btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>
          Back to Rooms
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

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#92400e', text: 'Pending' },
      pending_guest: { bg: '#fef3c7', color: '#92400e', text: 'Pending Registration' },
      confirmed: { bg: '#d1fae5', color: '#065f46', text: 'Confirmed' },
      cancelled: { bg: '#fee2e2', color: '#991b1b', text: 'Cancelled' },
      completed: { bg: '#dbeafe', color: '#1e40af', text: 'Completed' }
    };
    const style = styles[status] || styles.pending;
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '14px',
        fontWeight: '500',
        background: style.bg,
        color: style.color
      }}>
        {style.text}
      </span>
    );
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f9fafb' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Success Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
        }}>
          {success ? (
            <>
              <div style={{ fontSize: '64px', marginBottom: '8px' }}>🎉</div>
              <h1 style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", margin: '0 0 8px 0' }}>
                Payment Successful!
              </h1>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Your booking has been confirmed. Check your email for details.
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '64px', marginBottom: '8px' }}>📋</div>
              <h1 style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", margin: '0 0 8px 0' }}>
                Booking Confirmed
              </h1>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Your reservation at Azure Bay Resort is confirmed.
              </p>
            </>
          )}
        </div>

        {/* Booking Details */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontFamily: "'Playfair Display', serif", margin: 0 }}>
              Booking Details
            </h2>
            {getStatusBadge(booking.status)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Booking Reference</div>
              <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>
                #{booking.id.substring(0, 8)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Room</div>
              <div style={{ fontWeight: '600' }}>{booking.room_type}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Check-in</div>
              <div style={{ fontWeight: '600' }}>{formatDate(booking.check_in_date)}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Check-out</div>
              <div style={{ fontWeight: '600' }}>{formatDate(booking.check_out_date)}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Guests</div>
              <div style={{ fontWeight: '600' }}>{booking.guest_count || 1}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Price</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>
                £{booking.total_price}
              </div>
            </div>
          </div>

          {booking.special_requests && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Special Requests</div>
              <div style={{ fontSize: '14px', color: '#374151' }}>{booking.special_requests}</div>
            </div>
          )}
        </div>

        {/* Guest Info */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontSize: '20px', fontFamily: "'Playfair Display', serif", margin: '0 0 16px 0' }}>
            Guest Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Name</div>
              <div style={{ fontWeight: '600' }}>
                {user?.full_name || booking.guest_name || 'Guest'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Email</div>
              <div style={{ fontWeight: '600' }}>
                {user?.email || booking.guest_email || '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Phone</div>
              <div style={{ fontWeight: '600' }}>
                {user?.phone || '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            to="/my-bookings"
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            View My Bookings
          </Link>
          <Link
            to="/rooms"
            style={{
              padding: '12px 32px',
              background: '#f3f4f6',
              color: '#374151',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
          >
            Browse More Rooms
          </Link>
        </div>

        {/* Email confirmation note */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#f0f9ff',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          📧 A confirmation email has been sent to {user?.email || booking.guest_email || 'your email address'}
        </div>

        {/* Payment status (if available) */}
        {paymentStatus && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: paymentStatus.status === 'succeeded' ? '#dcfce7' : '#fef3c7',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '14px',
            color: paymentStatus.status === 'succeeded' ? '#166534' : '#92400e'
          }}>
            {paymentStatus.status === 'succeeded' 
              ? '✅ Payment confirmed' 
              : `⏳ Payment status: ${paymentStatus.status}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;