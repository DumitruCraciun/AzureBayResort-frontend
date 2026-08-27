// src/pages/RoomDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roomService, bookingService} from '../services/api';
import { useAuth } from '../context/AuthContext';


const RoomDetails = () => {
const { id } = useParams();
const navigate = useNavigate();
const { isAuthenticated, user } = useAuth();
  
const [room, setRoom] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [currentImage, setCurrentImage] = useState(0);
const [checkIn, setCheckIn] = useState('');
const [checkOut, setCheckOut] = useState('');
const [isAvailable, setIsAvailable] = useState(null);
const [checkingAvailability, setCheckingAvailability] = useState(false);
const [specialRequests, setSpecialRequests] = useState('');

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await roomService.getById(id);
        setRoom(response.data.room);
      } catch (err) {
        setError('Failed to load room details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  // Check availability when dates change
  useEffect(() => {
    if (checkIn && checkOut && room) {
      const checkAvailability = async () => {
        try {
          setCheckingAvailability(true);
          const response = await roomService.checkAvailability(room.id, checkIn, checkOut);
          setIsAvailable(response.data.isAvailable);
        } catch (err) {
          console.error('Availability check failed:', err);
          setIsAvailable(false);
        } finally {
          setCheckingAvailability(false);
        }
      };
      
      // Debounce: wait 500ms after user stops typing
      const timer = setTimeout(checkAvailability, 500);
      return () => clearTimeout(timer);
    }
  }, [checkIn, checkOut, room]);

  // Verifica ca check-out-ul să fie întotdeauna după check-in
  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    
    // Dacă check-out-ul există și este mai mic decât noul check-in
    if (checkOut && new Date(checkOut) <= new Date(newCheckIn)) {
      // Calculează o nouă dată de check-out (check-in + 1 zi)
      const newDate = new Date(newCheckIn);
      newDate.setDate(newDate.getDate() + 1);
      const newCheckOut = newDate.toISOString().split('T')[0];
      setCheckOut(newCheckOut);
    }
  };

  const handleBooking = async () => {
  try {
    if (isAuthenticated) {
      console.log('📝 Creating booking for user:', user?.email);
      
      const bookingData = {
        room_id: room.id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        guest_count: 1,
        special_requests: 'none',
        guest_name: user?.full_name || 'Guest',
      guest_email: user?.email || 'guest@email.com'        
      };
      
      console.log('📤 Booking data:', bookingData);
      
      // 🔥 Folosește bookingService (care are deja interceptorul cu token)
      const response = await bookingService.create(bookingData);
      
      console.log('✅ Booking created:', response.data);
      
      navigate(`/booking/${response.data.booking.id}`, { 
        state: { checkIn, checkOut, totalPrice: calculateTotal() } 
      });
    } else {
      // Guest user
      navigate('/guest-checkout', { 
        state: { 
          roomId: room.id, 
          checkIn, 
          checkOut, 
          totalPrice: calculateTotal(),
          roomType: room.room_type
        } 
      });
    }
  } catch (error) {
    console.error('❌ Booking creation failed:', error);
    console.error('❌ Response status:', error.response?.status);
    console.error('❌ Response data:', error.response?.data);
    alert('Booking failed: ' + (error.response?.data?.message || error.message));
    setError(error.response?.data?.message || 'Failed to create booking. Please try again.');
  }
};
  
  const calculateTotal = () => {
    if (!room || !checkIn || !checkOut) return 0;
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return room.price_per_night * days;
  };

  const nextImage = () => {
    if (room?.images) {
      setCurrentImage((prev) => (prev + 1) % room.images.length);
    }
  };

  const prevImage = () => {
    if (room?.images) {
      setCurrentImage((prev) => (prev - 1 + room.images.length) % room.images.length);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading room details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !room) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626' }}>⚠️ {error || 'Room not found'}</h2>
        <Link to="/rooms" className="hero-btn hero-btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>
          Back to Rooms
        </Link>
      </div>
    );
  }

  const totalPrice = calculateTotal();
  const imageBase = 'https://azurebayresort-backend.onrender.com';

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f9fafb' }}>
      <div className="container">
        {/* Back button */}
        <Link to="/rooms" style={{ 
          display: 'inline-block', 
          margin: '20px 0',
          color: '#3b82f6',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          ← Back to Rooms
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          {/* Image Gallery & Main Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
            
            {/* Image Gallery */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}>
              <div style={{ position: 'relative', height: '400px', background: '#f3f4f6' }}>
                <img
                  src={room.images?.[currentImage] ? `${imageBase}${room.images[currentImage]}` : '/placeholder-room.jpg'}
                  alt={room.room_type}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  crossOrigin="anonymous"
                />
                
                {/* Image navigation */}
                {room.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(255,255,255,0.8)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        fontSize: '20px'
                      }}
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(255,255,255,0.8)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        fontSize: '20px'
                      }}
                    >
                      ›
                    </button>
                    
                    {/* Image dots */}
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      {room.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          style={{
                            width: index === currentImage ? '32px' : '8px',
                            height: '8px',
                            borderRadius: '9999px',
                            border: 'none',
                            background: index === currentImage ? '#fbbf24' : 'rgba(255,255,255,0.6)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Room Info */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '32px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: '700', fontFamily: "'Playfair Display', serif", margin: '0 0 4px 0' }}>
                    {room.room_type}
                  </h1>
                  <p style={{ color: '#6b7280', margin: '0' }}>Room {room.room_number}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#2563eb' }}>
                    £{room.price_per_night}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>per night</div>
                </div>
              </div>

              <p style={{ margin: '24px 0', color: '#374151', lineHeight: '1.7' }}>
                {room.description || 'Experience luxury and comfort in this beautifully appointed room.'}
              </p>

              {/* Features */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Amenities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {room.features?.map((feature, index) => (
                    <span key={index} style={{
                      padding: '4px 14px',
                      background: '#f3f4f6',
                      borderRadius: '9999px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Max Occupancy</span>
                  <div style={{ fontWeight: '600' }}>{room.max_occupancy} {room.max_occupancy === 1 ? 'guest' : 'guests'}</div>
                </div>
                <div>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Rating</span>
                  <div style={{ fontWeight: '600' }}>
                    {room.averageRating > 0 ? `★ ${room.averageRating.toFixed(1)}` : 'No reviews yet'}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', paddingTop: '16px' }}>
                      Special Requests (optional)
                  </label>
                  <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          minHeight: '80px',
                          resize: 'vertical'
                      }}
                      placeholder="Any special requests? (e.g., early check-in, extra pillows, dietary requirements)"
                  />
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: "'Playfair Display', serif", margin: '0 0 20px 0' }}>
              Book This Room
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  //onChange={(e) => setCheckIn(e.target.value)}
                  onChange={handleCheckInChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Availability status */}
            {checkIn && checkOut && (
              <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: '#f3f4f6' }}>
                {checkingAvailability ? (
                  <span>Checking availability...</span>
                ) : isAvailable === true ? (
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>✅ Available for selected dates</span>
                ) : isAvailable === false ? (
                  <span style={{ color: '#dc2626', fontWeight: '600' }}>❌ Not available for selected dates</span>
                ) : null}
              </div>
            )}

            {/* Price Summary */}
            {checkIn && checkOut && isAvailable && totalPrice > 0 && (
              <div style={{ 
                marginTop: '20px', 
                padding: '16px',
                background: '#f0f9ff',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Total for {Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} nights</span>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>£{totalPrice}</div>
                </div>
                <button
                  onClick={handleBooking}
                  style={{
                    padding: '12px 32px',
                    background: 'linear-gradient(135deg, #2848a1, #2563eb)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '530',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 8px 24px rgba(251, 191, 36, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
                  }}
                >
                  {isAuthenticated ? 'Book Now' : 'Reserve & Register'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;