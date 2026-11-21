import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    restaurants: 0,
    orders: 0,
    reviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [u, r, o, rev] = await Promise.all([
        api.get('/users'),
        api.get('/restaurants'),
        api.get('/orders'),
        api.get('/reviews')
      ]);
      setStats({
        users: u.data?.length || 0,
        restaurants: r.data?.length || 0,
        orders: o.data?.length || 0,
        reviews: rev.data?.length || 0
      });
    } catch (e) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #E8E2DA', borderTopColor: '#211A17', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#211A17', marginBottom: '8px' }}>Dashboard Overview</h2>
      <p style={{ color: '#77716B', marginBottom: '32px' }}>Operational metrics and statistics</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        <div className="card">
          <span style={{ fontSize: '13px', color: '#77716B', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Users</span>
          <h3 style={{ fontSize: '36px', fontWeight: '800', color: '#211A17', marginTop: '8px' }}>{stats.users}</h3>
        </div>
        <div className="card">
          <span style={{ fontSize: '13px', color: '#77716B', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Restaurants</span>
          <h3 style={{ fontSize: '36px', fontWeight: '800', color: '#211A17', marginTop: '8px' }}>{stats.restaurants}</h3>
        </div>
        <div className="card">
          <span style={{ fontSize: '13px', color: '#77716B', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Orders</span>
          <h3 style={{ fontSize: '36px', fontWeight: '800', color: '#211A17', marginTop: '8px' }}>{stats.orders}</h3>
        </div>
        <div className="card">
          <span style={{ fontSize: '13px', color: '#77716B', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Feedback</span>
          <h3 style={{ fontSize: '36px', fontWeight: '800', color: '#211A17', marginTop: '8px' }}>{stats.reviews}</h3>
        </div>
      </div>
    </div>
  );
}
