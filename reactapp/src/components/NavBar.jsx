import React, { useState } from 'react';
import { ShoppingCart, MapPin, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function NavBar({ onNavigate }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const currentPath = window.location.pathname;
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) {
      return;
    }
    if (onNavigate) {
      onNavigate(`/restaurants?search=${encodeURIComponent(query)}`);
    }
  };

  const handleNav = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const navLinkStyle = (path) => {
    const isActive = currentPath === path || (path === '/' && currentPath === '/home');
    return {
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      padding: '6px 12px',
      borderRadius: '20px',
      backgroundColor: isActive ? '#211A17' : 'transparent',
      color: isActive ? '#FFFFFF' : '#554E4A',
      transition: 'all 0.2s',
      display: 'inline-block'
    };
  };

  return (
    <header style={{ 
      backgroundColor: '#FFFFFF', 
      borderTop: '6px solid #79523C', 
      borderBottom: '1px solid #E8E2DA', 
      padding: '12px 24px', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000 
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        
        {/* Brand Logo & Name */}
        <div onClick={() => handleNav('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ 
            backgroundColor: '#211A17', 
            color: '#FFFFFF', 
            width: '28px', 
            height: '28px', 
            borderRadius: '6px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: '900', 
            fontSize: '16px',
            lineHeight: 1,
            paddingLeft: '1px'
          }}>
            O
          </div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#211A17', letterSpacing: '-0.3px', textTransform: 'capitalize' }}>
            <span className="desktop-brand">online food ordering app</span>
            <span className="mobile-brand"></span>
          </span>
        </div>

        {/* Central Search and Location Display */}
        <div className="nav-search-container" style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto', maxWidth: '360px', margin: '0 16px', minWidth: '180px' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: '1 1 auto', minWidth: '0' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: '#A09A95' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              style={{
                width: '100%',
                padding: '6px 12px 6px 32px',
                borderRadius: '20px',
                border: '1px solid #E8E2DA',
                backgroundColor: '#FAF8F5',
                fontSize: '13px',
                outline: 'none',
                minWidth: '0'
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', color: '#77716B', fontSize: '12px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <MapPin size={14} style={{ color: '#A09A95' }} />
            <span>Coimbatore</span>
          </div>
        </div>

        {/* Navigation & Actions */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span onClick={() => handleNav('/')} style={navLinkStyle('/')}>Home</span>
          <span onClick={() => handleNav('/restaurants')} style={navLinkStyle('/restaurants')}>Restaurants</span>
          <span onClick={() => handleNav('/menus')} style={navLinkStyle('/menus')}>Menu</span>
          {isAuthenticated && (
            <span onClick={() => handleNav('/orders')} style={navLinkStyle('/orders')}>Orders</span>
          )}
          {isAuthenticated && user?.role?.toUpperCase() === 'ADMIN' && (
            <span onClick={() => handleNav('/admin')} style={navLinkStyle('/admin')}>Admin</span>
          )}
          {isAuthenticated && user?.role?.toUpperCase() === 'RESTAURANT' && (
            <span onClick={() => handleNav('/restaurant/dashboard')} style={navLinkStyle('/restaurant/dashboard')}>Restaurant Portal</span>
          )}

          {/* Cart & Authentication */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: '12px', paddingLeft: '12px', borderLeft: '1px solid #E8E2DA' }}>
            <div onClick={() => handleNav('/cart')} style={{ position: 'relative', cursor: 'pointer', color: '#554E4A' }}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-8px', 
                  right: '-8px', 
                  backgroundColor: '#C96F4A', 
                  color: 'white', 
                  fontSize: '11px', 
                  fontWeight: '700',
                  minWidth: '18px', 
                  height: '18px', 
                  padding: '0 5px',
                  borderRadius: '999px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  lineHeight: '1',
                  boxSizing: 'border-box'
                }}>
                  {cartCount}
                </span>
              )}
            </div>

            {isAuthenticated ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span onClick={() => handleNav('/profile')} style={{ cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#554E4A' }}>
                  Hi, {user?.username}
                </span>
                <button onClick={logout} className="btn" style={{ 
                  padding: '6px 14px', 
                  fontSize: '13px', 
                  borderRadius: '20px', 
                  borderColor: '#E8E2DA', 
                  color: '#554E4A', 
                  backgroundColor: 'transparent',
                  border: '1px solid #E8E2DA'
                }}>
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => handleNav('/login')} className="btn" style={{ 
                padding: '6px 20px', 
                fontSize: '13px', 
                borderRadius: '20px', 
                backgroundColor: '#C96F4A', 
                color: '#FFFFFF',
                fontWeight: 'bold',
                border: 'none',
                boxShadow: '0 2px 4px rgba(201, 111, 74, 0.2)'
              }}>
                Log In
              </button>
            )}
          </div>
        </nav>

        {/* Hamburger Button for mobile */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            color: '#211A17',
            padding: '4px'
          }}
        >
          ☰
        </button>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="mobile-dropdown" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E8E2DA',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            zIndex: 999
          }}>
            <span onClick={() => { handleNav('/'); setMenuOpen(false); }} style={navLinkStyle('/')}>Home</span>
            <span onClick={() => { handleNav('/restaurants'); setMenuOpen(false); }} style={navLinkStyle('/restaurants')}>Restaurants</span>
            <span onClick={() => { handleNav('/menus'); setMenuOpen(false); }} style={navLinkStyle('/menus')}>Menu</span>
            {isAuthenticated && (
              <span onClick={() => { handleNav('/orders'); setMenuOpen(false); }} style={navLinkStyle('/orders')}>Orders</span>
            )}
            {isAuthenticated && user?.role?.toUpperCase() === 'ADMIN' && (
              <span onClick={() => { handleNav('/admin'); setMenuOpen(false); }} style={navLinkStyle('/admin')}>Admin</span>
            )}
            {isAuthenticated && user?.role?.toUpperCase() === 'RESTAURANT' && (
              <span onClick={() => { handleNav('/restaurant/dashboard'); setMenuOpen(false); }} style={navLinkStyle('/restaurant/dashboard')}>Restaurant Portal</span>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E8E2DA', paddingTop: '12px', marginTop: '4px' }}>
              <div onClick={() => { handleNav('/cart'); setMenuOpen(false); }} style={{ position: 'relative', cursor: 'pointer', color: '#554E4A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={20} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Cart ({cartCount})</span>
              </div>

              {isAuthenticated ? (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span onClick={() => { handleNav('/profile'); setMenuOpen(false); }} style={{ cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#554E4A' }}>
                    Hi, {user?.username}
                  </span>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="btn" style={{ 
                    padding: '6px 14px', 
                    fontSize: '13px', 
                    borderRadius: '20px', 
                    borderColor: '#E8E2DA', 
                    color: '#554E4A', 
                    backgroundColor: 'transparent',
                    border: '1px solid #E8E2DA'
                  }}>
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => { handleNav('/login'); setMenuOpen(false); }} className="btn" style={{ 
                  padding: '6px 20px', 
                  fontSize: '13px', 
                  borderRadius: '20px', 
                  backgroundColor: '#C96F4A', 
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(201, 111, 74, 0.2)'
                }}>
                  Log In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
