import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Star, MessageSquare } from 'lucide-react';

export default function Reviews({ onNavigate }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews');
      setReviews(response.data || []);
    } catch (e) {
      toast.error('Failed to load reviews');
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
      <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#211A17', marginBottom: '8px' }}>My Reviews</h2>
      <p style={{ color: '#77716B', fontSize: '14px', marginBottom: '32px' }}>Reviews submitted by you for your orders.</p>

      {reviews.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FAF8F4', color: '#C96F4A', marginBottom: '16px' }}>
            <MessageSquare size={24} />
          </div>
          <p style={{ color: '#77716B', marginBottom: '20px' }}>No reviews yet.</p>
          <button onClick={() => onNavigate('/orders')} className="btn btn-primary" style={{ backgroundColor: '#211A17', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold', fontSize: '13px' }}>
            Review your completed orders
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map((rev) => {
            const dateStr = rev.reviewDate ? new Date(rev.reviewDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : '';

            return (
              <div
                key={rev.id}
                className="card"
                style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2DA' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#211A17' }}>Order #{rev.orderId}</h3>
                    {dateStr && <span style={{ fontSize: '12px', color: '#A09A95' }}>{dateStr}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < rev.rating ? '#C96F4A' : 'none'}
                        color={i < rev.rating ? '#C96F4A' : '#E8E2DA'}
                      />
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: '14px', color: '#554E4A', lineHeight: '1.6', fontStyle: 'italic', backgroundColor: '#FAF8F5', padding: '16px', borderRadius: '8px', borderLeft: '3px solid #C96F4A', margin: 0 }}>
                  "{rev.comment}"
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
