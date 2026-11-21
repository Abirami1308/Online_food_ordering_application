import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function DeliveryTracking({ onNavigate }) {
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
      toast.error('Unable to fetch delivery updates');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E8E2DA', borderTopColor: '#211A17', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#211A17', marginBottom: '24px' }}>Delivery Dispatches</h2>

      {deliveries.length === 0 ? (
        <p style={{ color: '#77716B' }}>No dispatches scheduled currently.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {deliveries.map((d) => (
            <div key={d.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: '700', color: '#211A17' }}>Partner: {d.deliveryPartnerName}</h4>
                <p style={{ fontSize: '13px', color: '#77716B', marginTop: '4px' }}>Address: {d.deliveryAddress}</p>
                <p style={{ fontSize: '13px', color: '#77716B' }}>Est. Time: {d.estimatedTimeMinutes} mins</p>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '4px', backgroundColor: '#FAF8F4', color: '#C96F4A', border: '1px solid #E8E2DA' }}>
                {d.deliveryStatus}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
