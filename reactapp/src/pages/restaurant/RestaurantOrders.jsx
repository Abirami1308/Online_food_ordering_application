import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatPrice } from '../../utils/priceFormatter';

export default function RestaurantOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data || []);
    } catch (e) {
      toast.error('Failed to load restaurant orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.restaurantId) {
      fetchOrders();
    }
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, {
        orderStatus: newStatus
      });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  const getStatusColor = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'placed') return { bg: '#EBF3FE', text: '#2A7BE4' };
    if (s === 'preparing') return { bg: '#FFF7E6', text: '#FF9E1B' };
    if (s === 'completed') return { bg: '#EAF9EA', text: '#3EAF3F' };
    if (s === 'delivered') return { bg: '#EBFBF0', text: '#6B8E23' };
    if (s === 'cancelled') return { bg: '#FDECEC', text: '#E05C5C' };
    return { bg: '#FAF8F4', text: '#77716B' };
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#211A17' }}>Customer Orders</h2>
        <p style={{ color: '#77716B', marginTop: '4px' }}>Track order status and fulfill incoming food orders</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 40px', border: '1px dashed #E8E2DA', borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
          <p style={{ color: '#77716B', fontSize: '15px' }}>No orders placed yet for your restaurant.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => {
            const colors = getStatusColor(order.orderStatus);
            return (
              <div key={order.id} className="card" style={{ padding: '24px', border: '1px solid #E8E2DA', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#211A17' }}>Order #{order.id}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', backgroundColor: colors.bg, color: colors.text, padding: '3px 8px', borderRadius: '4px' }}>
                      {order.orderStatus || 'Placed'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#211A17' }}>
                    {order.menuItemName} x {order.quantity}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#77716B', margin: 0 }}>
                    {order.menuItemDescription}
                  </p>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#C96F4A' }}>
                    Total: {formatPrice(order.menuItemPrice * order.quantity)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#77716B' }}>Update Status:</label>
                  <select
                    value={order.orderStatus || 'Placed'}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #E8E2DA', borderRadius: '8px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FFFFFF', cursor: 'pointer', outline: 'none' }}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Completed">Completed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
