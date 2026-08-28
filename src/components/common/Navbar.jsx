// src/components/common/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/rooms', label: 'Rooms' },
    { path: '/my-bookings', label: 'My Bookings' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="logo-icon">
              <span>A</span>
            </div>
            <div className="logo-text">
              <h1>Azure Bay</h1>
              <p>RESORT & SPA</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`btn-register ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="nav-auth">
                <span className="user-name">
                  {user?.full_name?.split(' ')[0] || 'User'}
                </span>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn-register" style={{ color: '#d97706' }}>
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-register">
                  Logout
                </button>
              </div>
            ) : (
              <div className="nav-auth">
                <Link to="/login" className="btn-register">
                  Login
                </Link>
                <Link to="/register" className="btn-register">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-inner">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <span className="mobile-user-name">
                  👤 {user?.full_name}
                </span>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="mobile-link register-link"
                    style={{ color: '#d97706' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ⚙️ Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="mobile-link register-link"
                  style={{ color: '#dc2626' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-link register-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mobile-link register-link"                  
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;