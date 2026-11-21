import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatPrice } from '../../utils/priceFormatter';

export default function RestaurantDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  // Restaurant Details Form
  const [name, setName] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Dashboard Stats
  const [menuCount, setMenuCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchData = useCallback(async () => {
    if (!user || !user.restaurantId) {
      setLoading(false);
      return;
    }
    try {
      // 1. Fetch Restaurant details
      const restRes = await api.get(`/restaurants/${user.restaurantId}`);
      setRestaurant(restRes.data);
      if (restRes.data) {
        setName(restRes.data.name || '');
        setCuisineType(restRes.data.cuisineType || '');
        setAddress(restRes.data.address || '');
        setPhoneNumber(restRes.data.phoneNumber || '');
      }

      // 2. Fetch Menu items count
      const menuRes = await api.get('/menus');
      const allMenus = menuRes.data || [];
      const myMenus = allMenus.filter(m => m.restaurantId === user.restaurantId);
      setMenuCount(myMenus.length);

      // 3. Fetch Orders details
      const ordersRes = await api.get('/orders');
      const myOrders = ordersRes.data || [];
      setTotalOrders(myOrders.length);
      
      const pending = myOrders.filter(o => o.orderStatus && o.orderStatus.toLowerCase() === 'placed');
      setPendingOrders(pending.length);
      
      // Get top 5 recent orders
      const sortedOrders = [...myOrders].reverse().slice(0, 5);
      setRecentOrders(sortedOrders);

    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [user, fetchData]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/restaurants/${user.restaurantId}`, {
        name,
        cuisineType,
        address,
        phoneNumber,
        rating: restaurant.rating || 5.0,
        isActive: restaurant.isActive !== undefined ? restaurant.isActive : true
      });
      setRestaurant(res.data);
      setEditing(false);
      toast.success('Restaurant information updated successfully!');
    } catch (err) {
      toast.error('Failed to update restaurant information.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E8E2DA', borderTopColor: '#211A17', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!user || !user.restaurantId) {
    return (
      <div className="container" style={{ padding: '40px 24px', textAlign: 'center' }}>
        <h2 style={{ color: '#E05C5C' }}>No Restaurant Associated</h2>
        <p style={{ color: '#77716B', marginTop: '12px' }}>Your user account does not seem to have an associated restaurant ID.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#211A17' }}>Welcome back, {user.username}!</h2>
          <p style={{ color: '#77716B', marginTop: '4px' }}>Here is what's happening at {restaurant?.name || 'your restaurant'} today.</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn btn-primary">
            Edit Info
          </button>
        )}
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card">
          <span style={{ fontSize: '13px', color: '#77716B', textTransform: 'uppercase', fontWeight: 'bold' }}>Status</span>
          <h3 style={{ fontSize: '28px', fontWeight: '800', color: restaurant?.isActive ? '#6B8E23' : '#E05C5C', marginTop: '8px' }}>
            {restaurant?.isActive ? 'Open' : 'Closed'}
          </h3>
        </div>
        <div className="card">
          <span style={{ fontSize: '13px', color: '#77716B', textTransform: 'uppercase', fontWeight: 'bold' }}>Menu Items</span>
          <h3 style={{ fontSize: '36px', fontWeight: '800', color: '#211A17', marginTop: '8px' }}>{menuCount}</h3>
        </div>
        <div className="card">
          <span style={{ fontSize: '13px', color: '#77716B', textTransform: 'uppercase', fontWeight: 'bold' }}>Pending Orders</span>
          <h3 style={{ fontSize: '36px', fontWeight: '800', color: '#FF9E1B', marginTop: '8px' }}>{pendingOrders}</h3>
        </div>
        <div className="card">
          <span style={{ fontSize: '13px', color: '#77716B', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Orders</span>
          <h3 style={{ fontSize: '36px', fontWeight: '800', color: '#211A17', marginTop: '8px' }}>{totalOrders}</h3>
        </div>
      </div>

      {editing ? (
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#211A17', marginBottom: '20px' }}>Edit Restaurant Details</h3>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Restaurant Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Cuisine Type</label>
              <input
                type="text"
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
              <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
          {/* Details */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#211A17', borderBottom: '1px solid #E8E2DA', paddingBottom: '12px', marginBottom: '20px' }}>Restaurant Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#A09890', fontWeight: '600' }}>Cuisine served</span>
                <p style={{ fontSize: '15px', color: '#211A17', fontWeight: '600', marginTop: '4px' }}>{restaurant?.cuisineType}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#A09890', fontWeight: '600' }}>Address</span>
                <p style={{ fontSize: '15px', color: '#211A17', marginTop: '4px' }}>{restaurant?.address}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#A09890', fontWeight: '600' }}>Contact Phone</span>
                <p style={{ fontSize: '15px', color: '#211A17', marginTop: '4px' }}>{restaurant?.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Recent orders */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#211A17', borderBottom: '1px solid #E8E2DA', paddingBottom: '12px', marginBottom: '20px' }}>Recent Orders</h3>
            {recentOrders.length === 0 ? (
              <p style={{ color: '#77716B', fontSize: '14px' }}>No orders found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentOrders.map(order => (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', borderBottom: '1px solid #FAF8F4', paddingBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: '700' }}>#{order.id}</span> {order.menuItemName}
                      <p style={{ fontSize: '12px', color: '#77716B' }}>Qty: {order.quantity}</p>
                    </div>
                    <span style={{ fontWeight: '600', color: '#C96F4A' }}>{formatPrice(order.menuItemPrice * order.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
