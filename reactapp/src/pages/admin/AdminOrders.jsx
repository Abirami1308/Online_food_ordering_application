import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/priceFormatter';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data || []);
    } catch (e) {
      toast.error('Unable to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const orderToUpdate = orders.find((o) => o.id === id);
      if (!orderToUpdate) return;
      
      await api.put(`/orders/${id}`, {
        ...orderToUpdate,
        orderStatus: newStatus
      });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
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
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#211A17', marginBottom: '8px' }}>Manage Orders</h2>
      <p style={{ color: '#77716B', marginBottom: '32px' }}>Update status and track preparation dispatches</p>

      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E2DA', backgroundColor: '#FAF8F4' }}>
              <th style={{ padding: '16px' }}>Order ID</th>
              <th style={{ padding: '16px' }}>Restaurant</th>
              <th style={{ padding: '16px' }}>Item Name</th>
              <th style={{ padding: '16px' }}>Price</th>
              <th style={{ padding: '16px' }}>Qty</th>
              <th style={{ padding: '16px' }}>Current Status</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid #E8E2DA' }}>
                <td style={{ padding: '16px', fontWeight: '600' }}>#{o.id}</td>
                <td style={{ padding: '16px' }}>{o.restaurantName}</td>
                <td style={{ padding: '16px' }}>{o.menuItemName}</td>
                <td style={{ padding: '16px' }}>{formatPrice(o.menuItemPrice)}</td>
                <td style={{ padding: '16px' }}>{o.quantity}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FAF8F4', color: '#C96F4A', border: '1px solid #E8E2DA' }}>
                    {o.orderStatus}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="input-field"
                    style={{ width: '160px', padding: '6px 12px' }}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
