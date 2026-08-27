// src/components/common/Footer.jsx - Versiune de test
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#111827', color: '#9ca3af', padding: '24px 0 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '24px',
          paddingBottom: '24px',
          borderBottom: '1px solid #1f2937'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #3b82f6, #fbbf24)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontFamily: 'serif', fontSize: '18px', fontWeight: 'bold' }}>A</span>
              </div>
              <div>
                <h2 style={{ fontFamily: 'serif', fontSize: '16px', fontWeight: 'bold', color: 'white', margin: 0 }}>Azure Bay</h2>
                <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#9ca3af', margin: 0 }}>RESORT & SPA</p>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#9ca3af', maxWidth: '400px', margin: 0 }}>
              Luxury retreat by the sea, crafted for unforgettable experiences.
            </p>
          </div>

          
        </div>

        <div style={{ padding: '16px 0', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
          <p style={{ margin: 0 }}>
            © {currentYear}{' '}
            <span style={{ color: 'white', fontWeight: '500' }}>Dumitru Craciun</span>
            . Built with{' '}
            <span style={{ color: '#fbbf24', fontWeight: '500' }}>React</span>
            ,{' '}
            <span style={{ color: '#fbbf24', fontWeight: '500' }}>Node.js</span>
            ,{' '}
            <span style={{ color: '#fbbf24', fontWeight: '500' }}>Express</span>
            {' & '}
            <span style={{ color: '#fbbf24', fontWeight: '500' }}>PostgreSQL</span>
            . Portfolio project.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;