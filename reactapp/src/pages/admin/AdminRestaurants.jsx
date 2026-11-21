import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    cuisineType: '',
    rating: 5.0,
    isActive: true
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants');
      setRestaurants(response.data || []);
    } catch (e) {
      toast.error('Unable to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phoneNumber || !formData.cuisineType) {
      toast.error('Please fill in all details');
      return;
    }
    try {
      if (editingId) {
        await api.put(`/restaurants/${editingId}`, formData);
        toast.success('Restaurant updated');
      } else {
        await api.post('/restaurants', formData);
        toast.success('Restaurant created');
      }
      setFormData({ name: '', address: '', phoneNumber: '', cuisineType: '', rating: 5.0, isActive: true });
      setEditingId(null);
      fetchRestaurants();
    } catch (err) {
      toast.error('Failed to submit restaurant details');
    }
  };

  const handleEdit = (r) => {
    setEditingId(r.id);
    setFormData({
      name: r.name || '',
      address: r.address || '',
      phoneNumber: r.phoneNumber || '',
      cuisineType: r.cuisineType || '',
      rating: r.rating || 5.0,
      isActive: r.isActive !== undefined ? r.isActive : true
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    try {
      await api.delete(`/restaurants/${id}`);
      toast.success('Restaurant deleted');
      fetchRestaurants();
    } catch (err) {
      toast.error('Failed to delete restaurant');
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
    <div style={{ padding: '40px' }} className="animate-fade-in">
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#211A17', marginBottom: '8px' }}>Restaurants Management</h2>
      <p style={{ color: '#77716B', marginBottom: '32px' }}>Configure restaurant profile info</p>

      {/* Editor Form */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>{editingId ? 'Edit Restaurant' : 'Add Restaurant'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Restaurant Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Cuisine Type</label>
            <input
              type="text"
              value={formData.cuisineType}
              onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Phone Number</label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Rating</label>
            <input
              type="number"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
              className="input-field"
              required
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              style={{ accentColor: '#C96F4A' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Active Status</span>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', address: '', phoneNumber: '', cuisineType: '', rating: 5.0, isActive: true });
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Grid listing */}
      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E2DA', backgroundColor: '#FAF8F4' }}>
              <th style={{ padding: '16px' }}>Name</th>
              <th style={{ padding: '16px' }}>Cuisine</th>
              <th style={{ padding: '16px' }}>Address</th>
              <th style={{ padding: '16px' }}>Phone</th>
              <th style={{ padding: '16px' }}>Rating</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #E8E2DA' }}>
                <td style={{ padding: '16px', fontWeight: '600' }}>{r.name}</td>
                <td style={{ padding: '16px' }}>{r.cuisineType}</td>
                <td style={{ padding: '16px' }}>{r.address}</td>
                <td style={{ padding: '16px' }}>{r.phoneNumber}</td>
                <td style={{ padding: '16px' }}>{r.rating}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ color: r.isActive ? '#87917B' : '#C96F4A', fontWeight: 'bold' }}>
                    {r.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleEdit(r)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                  <button onClick={() => handleDelete(r.id)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', borderColor: '#C96F4A', color: '#C96F4A' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
