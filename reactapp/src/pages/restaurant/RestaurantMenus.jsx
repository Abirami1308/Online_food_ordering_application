import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatPrice } from '../../utils/priceFormatter';

export default function RestaurantMenus() {
  const { user } = useAuth();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const fetchMenus = useCallback(async () => {
    try {
      const res = await api.get('/menus');
      const allMenus = res.data || [];
      // Filter menus for this restaurant
      const filtered = allMenus.filter(m => m.restaurantId === user?.restaurantId);
      setMenus(filtered);
    } catch (e) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.restaurantId) {
      fetchMenus();
    }
  }, [user, fetchMenus]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/menus', {
        itemName,
        description,
        price: parseFloat(price),
        category,
        isAvailable,
        restaurantId: user.restaurantId
      });
      toast.success('Menu item added successfully!');
      resetForm();
      fetchMenus();
    } catch (err) {
      toast.error('Failed to add menu item');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/menus/${editingItem.id}`, {
        itemName,
        description,
        price: parseFloat(price),
        category,
        isAvailable,
        restaurantId: user.restaurantId
      });
      toast.success('Menu item updated successfully!');
      resetForm();
      fetchMenus();
    } catch (err) {
      toast.error('Failed to update menu item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await api.delete(`/menus/${id}`);
      toast.success('Menu item deleted successfully!');
      fetchMenus();
    } catch (err) {
      toast.error('Failed to delete menu item');
    }
  };

  const resetForm = () => {
    setItemName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setIsAvailable(true);
    setEditingItem(null);
    setShowAddForm(false);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setItemName(item.itemName || '');
    setDescription(item.description || '');
    setPrice(item.price || '');
    setCategory(item.category || '');
    setIsAvailable(item.isAvailable !== undefined ? item.isAvailable : true);
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#211A17' }}>Menu Management</h2>
          <p style={{ color: '#77716B', marginTop: '4px' }}>Add, edit, or delete items on your active menu</p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
            + Add Menu Item
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="card" style={{ padding: '24px', marginBottom: '32px', border: '1px solid #E8E2DA', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#211A17' }}>
            {editingItem ? 'Edit Menu Item' : 'New Menu Item'}
          </h3>
          <form onSubmit={editingItem ? handleUpdate : handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
                placeholder="e.g. Main Course, Appetizer, Dessert"
                required
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                style={{ minHeight: '80px', fontFamily: 'inherit' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
              <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  style={{ accentColor: '#C96F4A', width: '16px', height: '16px' }}
                />
                Available for Order
              </label>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {menus.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed #E8E2DA', borderRadius: '12px' }}>
          <p style={{ color: '#77716B' }}>No menu items found. Get started by adding a new item!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {menus.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', border: '1px solid #E8E2DA', borderRadius: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', backgroundColor: '#FAF8F4', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E8E2DA', color: '#C96F4A' }}>{item.category}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: item.isAvailable ? '#6B8E23' : '#E05C5C' }}>
                    {item.isAvailable ? '● Available' : '○ Unavailable'}
                  </span>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', margin: '12px 0 6px 0', color: '#211A17' }}>{item.itemName}</h4>
                <p style={{ fontSize: '14px', color: '#77716B', lineBreak: 'anywhere' }}>{item.description}</p>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E8E2DA', paddingTop: '16px' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#C96F4A' }}>{formatPrice(item.price)}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => startEdit(item)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="btn" style={{ padding: '6px 12px', fontSize: '12px', color: '#E05C5C', border: '1px solid #E9E1DF', backgroundColor: '#FFF' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
