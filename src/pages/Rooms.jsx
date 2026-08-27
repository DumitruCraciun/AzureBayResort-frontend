// src/pages/Rooms.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomService } from '../services/api';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    maxOccupancy: '',
    roomType: ''
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getAll();
      setRooms(response.data.rooms || []);
    } catch (err) {
      setError('Failed to load rooms. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await roomService.getTypes();
      setRoomTypes(response.data.types || []);
    } catch (err) {
      console.error('Failed to load room types:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const filteredFilters = {};
      for (const [key, value] of Object.entries(filters)) {
        if (value !== '' && value !== null && value !== undefined) {
          if (key === 'minPrice' || key === 'maxPrice') {
            filteredFilters[key] = parseFloat(value);
          } else if (key === 'maxOccupancy') {
            filteredFilters[key] = parseInt(value);
          } else {
            filteredFilters[key] = value;
          }
        }
      }
      const response = await roomService.getAll(filteredFilters);
      setRooms(response.data.rooms || []);
    } catch (err) {
      setError('Failed to apply filters. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      maxOccupancy: '',
      roomType: ''
    });
    await fetchRooms();
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="rooms-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading our rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rooms-error">
        <div className="error-icon">⚠️</div>
        <div className="error-message">{error}</div>
        <button onClick={fetchRooms} className="error-retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="rooms-page">
      {/* Hero Section */}
      <div className="rooms-hero">
        <div className="container">
          <h1 className="rooms-hero-title">Our Rooms</h1>
          <p className="rooms-hero-subtitle">
            Discover our collection of luxury rooms and suites, each designed 
            for your ultimate comfort and relaxation.
          </p>
        </div>
      </div>

      <div className="container rooms-layout">
        {/* Filter Toggle Button - Mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="filters-toggle"
        >
          <span>Filters</span>
          <svg className={`filters-toggle-icon ${showFilters ? 'open' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="rooms-content">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${showFilters ? 'visible' : 'hidden'}`}>
            <div className="filters-card">
              <h3 className="filters-title">Filter Rooms</h3>
              
              <div className="filters-group">
                {/* Min Price */}
                <div className="filter-item">
                  <label className="filter-label">Min Price (£)</label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="filter-input"
                    placeholder="e.g. 50"
                    min="0"
                  />
                </div>

                {/* Max Price */}
                <div className="filter-item">
                  <label className="filter-label">Max Price (£)</label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="filter-input"
                    placeholder="e.g. 200"
                    min="0"
                  />
                </div>

                {/* Max Occupancy */}
                <div className="filter-item">
                  <label className="filter-label">Guests</label>
                  <select
                    name="maxOccupancy"
                    value={filters.maxOccupancy}
                    onChange={handleFilterChange}
                    className="filter-select"
                  >
                    <option value="">Any</option>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>

                {/* Room Type */}
                <div className="filter-item">
                  <label className="filter-label">Room Type</label>
                  <select
                    name="roomType"
                    value={filters.roomType}
                    onChange={handleFilterChange}
                    className="filter-select"
                  >
                    <option value="">All Types</option>
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={applyFilters}
                  className="filter-apply-btn"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="filter-reset-btn"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="rooms-grid">
            {/* Results Count */}
            <div className="rooms-count">
              {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} available
            </div>

            {rooms.length === 0 ? (
              <div className="rooms-empty">
                <p className="rooms-empty-text">No rooms match your filters.</p>
                <button onClick={resetFilters} className="rooms-empty-btn">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="rooms-grid-cards">
                {rooms.map((room) => (
  <Link
    key={room.id}
    to={`/rooms/${room.id}`}
    className="room-card-link"
    style={{ textDecoration: 'none', display: 'block' }}
  >
    <div className="room-card">
      {/* Image */}
      <div className="room-card-image">
        <img
          src={room.images?.[0] ? `https://azurebayresort-backend.onrender.com${room.images[0]}` : '/placeholder-room.jpg'}
          alt={room.room_type}
          crossOrigin="anonymous"
        />
        <div className="room-card-price">
          <span className="amount">£{room.price_per_night}</span>
          <span className="period">/night</span>
        </div>
        {room.averageRating > 0 && (
          <div className="room-card-rating">
            ★ {room.averageRating.toFixed(1)} ({room.reviewCount})
          </div>
        )}
      </div>

      {/* Content */}
      <div className="room-card-body">
        <h3 className="room-card-title">{room.room_type}</h3>
        <p className="room-card-number">Room {room.room_number}</p>

        {/* Features */}
        <div className="room-card-features">
          {room.features?.slice(0, 3).map((feature, index) => (
            <span key={index} className="room-card-feature">
              {feature}
            </span>
          ))}
          {room.features?.length > 3 && (
            <span className="room-card-feature">
              +{room.features.length - 3}
            </span>
          )}
        </div>

        {/* Butonul View Details - eliminat complet */}
      </div>
    </div>
  </Link>
))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;