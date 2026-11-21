import React from 'react';

export default function Footer({ onNavigate }) {
  const handleNav = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <footer style={{ 
      backgroundColor: '#FFFFFF', 
      color: '#554E4A', 
      padding: '48px 24px 24px 24px', 
      borderTop: '1px solid #E8E2DA', 
      marginTop: 'auto',
      fontSize: '13px'
    }}>
      <div className="container footer-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '40px',
        marginBottom: '32px'
      }}>
        {/* Brand Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ 
              backgroundColor: '#211A17', 
              color: '#FFFFFF', 
              width: '24px', 
              height: '24px', 
              borderRadius: '4px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: '900', 
              fontSize: '13px'
            }}>
              O
            </div>
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#211A17', textTransform: 'capitalize' }}>
              online food ordering app
            </span>
          </div>
          <p style={{ color: '#77716B', lineHeight: '1.6' }}>Good food, delivered beautifully.</p>
        </div>

        {/* Explore Column */}
        <div>
          <h4 style={{ color: '#211A17', fontWeight: '700', marginBottom: '16px' }}>Explore</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
            <li onClick={() => handleNav('/restaurants')} style={{ cursor: 'pointer', color: '#77716B' }}>Restaurants</li>
            <li onClick={() => handleNav('/menus')} style={{ cursor: 'pointer', color: '#77716B' }}>Menu</li>
            <li onClick={() => handleNav('/reviews')} style={{ cursor: 'pointer', color: '#77716B' }}>Reviews</li>
          </ul>
        </div>

        {/* Account Column */}
        <div>
          <h4 style={{ color: '#211A17', fontWeight: '700', marginBottom: '16px' }}>Account</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
            <li onClick={() => handleNav('/orders')} style={{ cursor: 'pointer', color: '#77716B' }}>Your orders</li>
            <li onClick={() => handleNav('/profile')} style={{ cursor: 'pointer', color: '#77716B' }}>Profile</li>
          </ul>
        </div>

        {/* Location & Extra Info */}
        <div>
          <h4 style={{ color: '#211A17', fontWeight: '700', marginBottom: '16px' }}>Online Food Ordering App</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, color: '#77716B' }}>
            <li>Coimbatore, Tamil Nadu</li>
            <li>Cash on delivery available</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="container" style={{ 
        borderTop: '1px solid #E8E2DA', 
        paddingTop: '20px', 
        fontSize: '11px', 
        color: '#A09A95',
        textAlign: 'center' 
      }}>
        &copy; {new Date().getFullYear()} Online Food Ordering App. A student project built for demonstration.
      </div>
    </footer>
  );
}
