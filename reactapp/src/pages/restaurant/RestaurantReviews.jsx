import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function RestaurantReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      // Endpoint filters by authenticated user's restaurant assignment
      const res = await api.get('/reviews');
      setReviews(res.data || []);
    } catch (e) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.restaurantId) {
      fetchReviews();
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const count = rating || 5;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= count ? '#E8A838' : '#E8E2DA', fontSize: '18px', marginRight: '2px' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#211A17' }}>Restaurant Reviews</h2>
        <p style={{ color: '#77716B', marginTop: '4px' }}>See reviews and feedback submitted by customers</p>
      </div>

      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 40px', border: '1px dashed #E8E2DA', borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
          <p style={{ color: '#77716B', fontSize: '15px' }}>No reviews submitted for your restaurant yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map((review) => (
            <div key={review.id} className="card" style={{ padding: '24px', border: '1px solid #E8E2DA', borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {renderStars(review.rating)}
                </div>
                <span style={{ fontSize: '12px', color: '#A09890', fontWeight: '600' }}>
                  {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'Recent'}
                </span>
              </div>
              <p style={{ fontSize: '15px', color: '#292522', lineHeight: '1.6', margin: '0 0 12px 0', fontStyle: 'italic' }}>
                "{review.comment}"
              </p>
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #FAF8F4', paddingTop: '10px', fontSize: '12px', color: '#77716B', fontWeight: '600' }}>
                <span>Order ID: #{review.orderId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
