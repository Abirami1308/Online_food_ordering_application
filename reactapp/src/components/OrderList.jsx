import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function OrderList({ refresh }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data || []);
    } catch (err) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Order deleted');
      setOrders(orders.filter((order) => order.id !== id));
    } catch (err) {
      toast.error('Failed to delete order.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '24px auto', padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2DA' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#211A17' }}>All Orders</h2>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid #E8E2DA', borderTopColor: '#211A17', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : orders.length === 0 ? (
        <p style={{ color: '#77716B', textAlign: 'center', padding: '24px 0' }}>No orders found.</p>
      ) : (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <li
              key={order.id}
              role="listitem"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #E8E2DA', borderRadius: '8px', backgroundColor: '#FAF8F4' }}
            >
              <div>
                <h4 style={{ fontWeight: '600', color: '#292522' }}>{order.menuItemName}</h4>
                <p style={{ fontSize: '14px', color: '#77716B' }}>
                  Restaurant: <span style={{ fontWeight: '500' }}>{order.restaurantName}</span> | Qty: {order.quantity} | Status: <span style={{ color: '#C96F4A', fontWeight: '500' }}>{order.orderStatus}</span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(order.id)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '13px', borderColor: '#C96F4A', color: '#C96F4A' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
