import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await api.get('/deliveries');
      setDeliveries(response.data || []);
    } catch (e) {
      toast.error('Unable to fetch deliveries list');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const dispatch = deliveries.find((d) => d.id === id);
      if (!dispatch) return;
      await api.put(`/deliveries/${id}`, {
        ...dispatch,
        deliveryStatus: status
      });
      toast.success('Delivery status updated');
      fetchDeliveries();
    } catch (err) {
      toast.error('Failed to update delivery');
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
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#211A17', marginBottom: '8px' }}>Delivery Assignments</h2>
      <p style={{ color: '#77716B', marginBottom: '32px' }}>Track agent routing status and estimated preparation timing</p>

      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E2DA', backgroundColor: '#FAF8F4' }}>
              <th style={{ padding: '16px' }}>Delivery ID</th>
              <th style={{ padding: '16px' }}>Order ID</th>
              <th style={{ padding: '16px' }}>Rider Name</th>
              <th style={{ padding: '16px' }}>Delivery Address</th>
              <th style={{ padding: '16px' }}>Phone</th>
              <th style={{ padding: '16px' }}>Est. Time (mins)</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d.id} style={{ borderBottom: '1px solid #E8E2DA' }}>
                <td style={{ padding: '16px', fontWeight: '600' }}>#{d.id}</td>
                <td style={{ padding: '16px' }}>#{d.orderId}</td>
                <td style={{ padding: '16px' }}>{d.deliveryPartnerName}</td>
                <td style={{ padding: '16px' }}>{d.deliveryAddress}</td>
                <td style={{ padding: '16px' }}>{d.phoneNumber || 'N/A'}</td>
                <td style={{ padding: '16px' }}>{d.estimatedTimeMinutes} mins</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FAF8F4', color: '#C96F4A', border: '1px solid #E8E2DA' }}>
                    {d.deliveryStatus}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <select
                    value={d.deliveryStatus}
                    onChange={(e) => handleStatusUpdate(d.id, e.target.value)}
                    className="input-field"
                    style={{ width: '150px', padding: '6px 12px' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
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
