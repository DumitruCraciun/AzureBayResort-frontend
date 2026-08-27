// src/pages/MyBookings.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const { user, isAuthenticated } = useAuth(); 
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Verifică autentificarea la încărcarea paginii
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirecționează la login cu state pentru a reveni după autentificare
      navigate('/login', { 
        state: { 
          from: { pathname: '/my-bookings' },
          message: 'Please login to view your bookings' 
        } 
      });
      return;
    }
  }, [isAuthenticated, navigate]);

useEffect(() => {
    // Dacă nu e autentificat, nu face fetch
    if (!isAuthenticated) return;
    
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getAll();
        setBookings(response.data.bookings || []);
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [isAuthenticated]);

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
      pending: { bg: '#fef3c7', color: '#92400e', text: 'Pending Payment' },
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
        fontSize: '12px',
        fontWeight: '600',
        background: style.bg,
        color: style.color
      }}>
        {style.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626' }}>⚠️ {error}</h2>
        <Link to="/rooms" className="hero-btn hero-btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>
          Browse Rooms
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f9fafb' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", marginBottom: '8px' }}>
          My Bookings
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          {bookings.length === 0 
            ? "You don't have any bookings yet." 
            : `You have ${bookings.length} booking${bookings.length > 1 ? 's' : ''}`}
        </p>

        {bookings.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '16px' }}>
              🌊 No bookings yet. Start your Azure Bay experience!
            </p>
            <Link to="/rooms" className="btn-register" style={{ display: 'inline-block' }}>
              Explore Rooms
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map((booking) => (
              <div key={booking.id} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ flex: '1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                      {booking.room_type || 'Room'}
                    </h3>
                    {getStatusBadge(booking.status)}
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0' }}>
                    Room {booking.room_number || 'N/A'}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '14px', color: '#374151' }}>
                    <span>📅 {formatDate(booking.check_in_date)} → {formatDate(booking.check_out_date)}</span>
                    <span>👤 {booking.guest_count || 1} guest{booking.guest_count > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#2563eb' }}>
                    £{booking.total_price}
                  </div>
                  
                  {booking.status === 'pending' && (
                    <Link
                      to={`/booking/${booking.id}`}
                      style={{
                        padding: '10px 24px',
                        background: 'linear-gradient(135deg, #8061b8, #512794)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
                        display: 'inline-block'
                      }}
                    >
                      Pay Now
                    </Link>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <span style={{ color: '#16a34a', fontWeight: '600' }}>
                      ✅ Confirmed
                    </span>
                  )}
                  
                  {booking.status === 'cancelled' && (
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>
                      Cancelled
                    </span>
                  )}
                  
                  {booking.status === 'completed' && (
                    <span style={{ color: '#2563eb', fontWeight: '600' }}>
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;