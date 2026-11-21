import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/priceFormatter';

export default function AdminMenus() {
  const [menus, setMenus] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
    restaurantId: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const menuRes = await api.get('/menus');
      setMenus(menuRes.data || []);

      const restRes = await api.get('/restaurants');
      setRestaurants(restRes.data || []);
      if (restRes.data?.length > 0) {
        setFormData((prev) => {
          if (!prev.restaurantId) {
            return { ...prev, restaurantId: restRes.data[0].id };
          }
          return prev;
        });
      }
    } catch (e) {
      toast.error('Unable to fetch menus');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName || !formData.description || !formData.price || !formData.category || !formData.restaurantId) {
      toast.error('All fields are required');
      return;
    }
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        restaurantId: Number(formData.restaurantId)
      };
      if (editingId) {
        await api.put(`/menus/${editingId}`, payload);
        toast.success('Menu item updated');
      } else {
        await api.post('/menus', payload);
        toast.success('Menu item created');
      }
      setFormData({ itemName: '', description: '', price: '', category: '', isAvailable: true, restaurantId: restaurants[0]?.id || '' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to submit menu details');
    }
  };

  const handleEdit = (m) => {
    setEditingId(m.id);
    setFormData({
      itemName: m.itemName || '',
      description: m.description || '',
      price: m.price || '',
      category: m.category || '',
      isAvailable: m.isAvailable !== undefined ? m.isAvailable : true,
      restaurantId: m.restaurantId || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await api.delete(`/menus/${id}`);
      toast.success('Menu item deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete menu item');
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
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#211A17', marginBottom: '8px' }}>Menu Card management</h2>
      <p style={{ color: '#77716B', marginBottom: '32px' }}>Configure cuisine details for active tables</p>

      {/* Editor Form */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Item Name</label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Restaurant</label>
            <select
              value={formData.restaurantId}
              onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select Restaurant</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Price (₹)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              placeholder="e.g. Desserts, Main Course"
              required
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
              required
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              style={{ accentColor: '#C96F4A' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Available Status</span>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ itemName: '', description: '', price: '', category: '', isAvailable: true, restaurantId: restaurants[0]?.id || '' });
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
              <th style={{ padding: '16px' }}>Item Name</th>
              <th style={{ padding: '16px' }}>Restaurant</th>
              <th style={{ padding: '16px' }}>Category</th>
              <th style={{ padding: '16px' }}>Price</th>
              <th style={{ padding: '16px' }}>Availability</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((m) => {
              const restName = restaurants.find((r) => r.id === m.restaurantId)?.name || 'Unknown';
              return (
                <tr key={m.id} style={{ borderBottom: '1px solid #E8E2DA' }}>
                  <td style={{ padding: '16px', fontWeight: '600' }}>{m.itemName}</td>
                  <td style={{ padding: '16px' }}>{restName}</td>
                  <td style={{ padding: '16px' }}>{m.category}</td>
                  <td style={{ padding: '16px' }}>{formatPrice(m.price)}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: m.isAvailable ? '#87917B' : '#C96F4A', fontWeight: 'bold' }}>
                      {m.isAvailable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(m)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                    <button onClick={() => handleDelete(m.id)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', borderColor: '#C96F4A', color: '#C96F4A' }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
