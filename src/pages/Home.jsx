// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Images from /media folder
  const heroImages = [
    '/media/1.jpg',
    '/media/2.jpg',
    '/media/3.jpg',
    '/media/4.jpg',
    '/media/5.jpg',
    '/media/6.jpg',
    '/media/7.jpg',
    '/media/8.jpg',
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const promises = heroImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(promises);
      setIsLoaded(true);
    };
    loadImages();
  }, [heroImages]);

  // Features data
  const features = [
    {
      icon: '🌊',
      title: 'Ocean View',
      description: 'Every room offers breathtaking sea views'
    },
    {
      icon: '🍽️',
      title: 'Fine Dining',
      description: 'Award-winning restaurants with local cuisine'
    },
    {
      icon: '🧖',
      title: 'Luxury Spa',
      description: 'Full-service spa with ocean-inspired treatments'
    },
    {
      icon: '🏊',
      title: 'Infinity Pool',
      description: 'Heated infinity pool overlooking the sea'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Sarah & Michael',
      text: 'An unforgettable honeymoon! The suite was stunning and the service impeccable.',
      rating: 5
    },
    {
      name: 'James Wilson',
      text: 'The best resort experience I\'ve ever had. The attention to detail is remarkable.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      text: 'Perfect family vacation. Our kids loved the pool and we loved the spa!',
      rating: 5
    }
  ];

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading Azure Bay...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section with Slideshow */}
      <section className="hero-section">
        {/* Slideshow Images */}
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentImage ? 'visible' : 'hidden'}`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="hero-overlay"></div>
          </div>
        ))}

        {/* Image Indicators */}
        <div className="slide-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`slide-dot ${index === currentImage ? 'active' : 'inactive'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <div className="container">
            <div className="hero-inner">
              <div className="hero-badge">✨ Where Luxury Meets the Sea</div>
              
              <h1 className="hero-title">
                <span>Your Dream</span>
                <span className="highlight">Ocean Escape</span>
              </h1>
              
              <p className="hero-description">
                Experience unparalleled luxury at Azure Bay Resort. 
                Where azure waters meet timeless elegance, and every moment 
                is crafted to perfection.
              </p>

              {/* Action Buttons */}
              <div className="hero-buttons">
                <Link to="/rooms" className="hero-btn hero-btn-primary">
                  <span className="shimmer"></span>
                  Explore Rooms
                </Link>               
              </div>

              {/* Quick Stats */}
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">6</div>
                  <div className="stat-label">Luxury Suites</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">4.9 ★</div>
                  <div className="stat-label">Guest Rating</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Premium Service</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-indicator-inner">
            <div className="scroll-dot"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Discover Azure Bay</h2>
            <p className="section-subtitle">Every detail designed to create your perfect escape</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Guests Say</h2>
            <p className="section-subtitle">Real experiences from real guests</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <p className="testimonial-name">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg">
          <img src="/media/1.jpg" alt="Azure Bay Resort" />
          <div className="cta-overlay"></div>
        </div>
        
        <div className="cta-content">
          <h2 className="cta-title">Ready for Your Escape?</h2>
          <p className="cta-text">
            Book your stay today and experience the luxury of Azure Bay Resort.
            Your perfect ocean getaway awaits.
          </p>
          <Link to="/rooms" className="cta-button">
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;