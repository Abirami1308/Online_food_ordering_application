import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [revRes, restRes] = await Promise.all([
        api.get('/reviews'),
        api.get('/restaurants')
      ]);
      setReviews(revRes.data || []);
      setRestaurants(restRes.data || []);
    } catch (e) {
      toast.error('Unable to fetch reviews data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete review');
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
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#211A17', marginBottom: '8px' }}>Reviews Logs</h2>
      <p style={{ color: '#77716B', marginBottom: '32px' }}>Monitor customer ratings and feedback</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {reviews.map((rev) => {
          const restName = restaurants.find((r) => r.id === rev.restaurantId)?.name || 'Restaurant';
          const dateStr = rev.reviewDate ? new Date(rev.reviewDate).toLocaleString('en-IN') : 'N/A';
          return (
            <div key={rev.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#77716B', flexWrap: 'wrap' }}>
                  <span>Review ID: #{rev.id}</span>
                  <span>•</span>
                  <span>User ID: #{rev.userId}</span>
                  {rev.orderId && (
                    <>
                      <span>•</span>
                      <span>Order ID: #{rev.orderId}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>Date: {dateStr}</span>
                </div>
                <h4 style={{ fontWeight: '700', color: '#211A17', marginTop: '6px', marginBottom: '4px' }}>{restName}</h4>
                <div style={{ display: 'flex', gap: '4px', margin: '4px 0', color: '#C96F4A' }}>
                  {Array.from({ length: rev.rating || 0 }).map((_, i) => (
                    <Star key={i} size={14} fill="#C96F4A" />
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: '#292522', marginTop: '8px' }}>{rev.comment}</p>
              </div>

              <button onClick={() => handleDelete(rev.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', borderColor: '#C96F4A', color: '#C96F4A' }}>
                Delete Review
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
