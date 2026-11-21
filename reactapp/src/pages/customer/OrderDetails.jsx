import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/priceFormatter';

export default function OrderDetails({ onNavigate }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (e) {
        toast.error('Unable to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getStatusStep = (status) => {
    const steps = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E8E2DA', borderTopColor: '#211A17', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p>Order details not found.</p>
      </div>
    );
  }

  const currentStep = getStatusStep(order.orderStatus);

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#211A17', marginBottom: '8px' }}>Order Tracking</h2>
      <p style={{ color: '#77716B', marginBottom: '32px' }}>Track preparation and delivery status in real-time</p>

      {/* Details Box */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E8E2DA', paddingBottom: '16px', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#77716B', textTransform: 'uppercase' }}>Order ID: #{order.id}</span>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#211A17' }}>{order.restaurantName}</h3>
          </div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#211A17' }}>
            {formatPrice(order.menuItemPrice * order.quantity || 0)}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
          <div>
            <span style={{ color: '#77716B' }}>Item:</span> <span style={{ color: '#292522', fontWeight: '500' }}>{order.menuItemName}</span>
          </div>
          <div>
            <span style={{ color: '#77716B' }}>Description:</span> <span style={{ color: '#292522' }}>{order.menuItemDescription}</span>
          </div>
          <div>
            <span style={{ color: '#77716B' }}>Quantity:</span> <span style={{ color: '#292522', fontWeight: '500' }}>{order.quantity}</span>
          </div>
        </div>
      </div>

      {/* Timeline tracker */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#211A17', marginBottom: '24px' }}>Preparation Timeline</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
          {['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#87917B' : '#FFFFFF',
                  border: isCompleted ? '2px solid #87917B' : '2px solid #E8E2DA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  zIndex: 2
                }}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div>
                  <h4 style={{ fontWeight: '600', color: isCurrent ? '#C96F4A' : '#292522', fontSize: '15px' }}>
                    {step}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#77716B' }}>
                    {isCompleted ? 'Completed status update.' : 'Pending kitchen updates.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
