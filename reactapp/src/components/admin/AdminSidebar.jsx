import React from 'react';
import { Home, Users, Store, Coffee, ClipboardList, CreditCard, Truck, Star, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ onNavigate, activePath }) {
  const { logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: <Home size={18} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
    { name: 'Restaurants', path: '/admin/restaurants', icon: <Store size={18} /> },
    { name: 'Menus', path: '/admin/menus', icon: <Coffee size={18} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ClipboardList size={18} /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={18} /> },
    { name: 'Deliveries', path: '/admin/deliveries', icon: <Truck size={18} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <Star size={18} /> }
  ];

  const handleNav = (path) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <aside className="admin-sidebar" style={{ backgroundColor: '#211A17', color: '#FAF8F4', padding: '32px 20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 onClick={() => handleNav('/')} className="admin-sidebar-logo" style={{ fontSize: '18px', fontWeight: '800', marginBottom: '40px', color: '#FAF8F4', cursor: 'pointer', textAlign: 'center' }}>
        FOOD ORDERING
      </h2>

      <nav className="admin-sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {links.map((link) => {
          const isActive = activePath === link.path;
          return (
            <div
              key={link.path}
              onClick={() => handleNav(link.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: isActive ? '#C96F4A' : '#FAF8F4',
                transition: 'all 0.2s'
              }}
            >
              {link.icon}
              <span>{link.name}</span>
            </div>
          );
        })}
      </nav>

      <div
        onClick={logout}
        className="admin-sidebar-logout"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#FAF8F4',
          marginTop: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '20px'
        }}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </div>
    </aside>
  );
}
