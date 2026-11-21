import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/priceFormatter';
import { Star } from 'lucide-react';

export default function Orders({ onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [reviewedOrderIds, setReviewedOrderIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Review Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchOrdersAndReviews();
  }, []);

  const fetchOrdersAndReviews = async () => {
    try {
      const [ordersRes, reviewsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/reviews')
      ]);
      setOrders(ordersRes.data || []);
      const revs = reviewsRes.data || [];
      setReviewedOrderIds(new Set(revs.map(r => r.orderId)));
    } catch (e) {
      toast.error('Failed to retrieve orders list');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Order deleted');
      setOrders(orders.filter((order) => order.id !== id));
    } catch (err) {
      toast.error('Failed to delete order.');
    }
  };

  const openReviewModal = (order) => {
    setSelectedOrder(order);
    setRating(5);
    setComment('');
    setIsModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error('Please enter rating and comment');
      return;
    }
    try {
      await api.post('/reviews', {
        orderId: selectedOrder.id,
        rating: rating,
        comment: comment.trim()
      });
      toast.success('Review submitted successfully!');
      closeReviewModal();
      fetchOrdersAndReviews();
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error('Review already submitted.');
      } else if (err.response && err.response.status === 403) {
        toast.error('You are not allowed to review this order.');
      } else {
        toast.error('Failed to submit review.');
      }
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
    <div className="container animate-fade-in" style={{ padding: '40px 24px', maxWidth: '900px' }}>
      <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#211A17', marginBottom: '24px' }}>Your Orders</h2>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: '#77716B', marginBottom: '16px' }}>No orders found in your profile history.</p>
          <button onClick={() => onNavigate('/restaurants')} className="btn btn-primary">Browse Cuisines</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((o) => {
            const isReviewed = reviewedOrderIds.has(o.id);
            const canReview = o.orderStatus === 'Delivered' || o.orderStatus === 'Completed';

            return (
              <div
                key={o.id}
                role="listitem"
                className="order-card-row"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2DA' }}
              >
                <div>
                  <span style={{ fontSize: '12px', color: '#77716B', textTransform: 'uppercase', tracking: 'wide' }}>Order ID: #{o.id}</span>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#211A17', margin: '4px 0' }}>{o.menuItemName}</h3>
                  <p style={{ fontSize: '13px', color: '#77716B' }}>
                    Restaurant: <span style={{ color: '#292522', fontWeight: '500' }}>{o.restaurantName}</span> | Qty: {o.quantity} | Cuisine: {o.cuisineType}
                  </p>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#FAF8F4', color: '#C96F4A', border: '1px solid #E8E2DA' }}>
                      {o.orderStatus}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#211A17' }}>
                    {formatPrice(o.menuItemPrice * o.quantity || 0)}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {canReview && (
                      isReviewed ? (
                        <span style={{ fontSize: '13px', color: '#87917B', fontWeight: 'bold', padding: '6px 12px' }}>
                          Review Submitted ✓
                        </span>
                      ) : (
                        <button onClick={() => openReviewModal(o)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: '#211A17', color: '#FFFFFF', border: 'none' }}>
                          Write Review
                        </button>
                      )
                    )}
                    <button onClick={() => onNavigate(`/orders/${o.id}`)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                      View Tracking
                    </button>
                    <button onClick={() => handleDelete(o.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', borderColor: '#C96F4A', color: '#C96F4A' }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {isModalOpen && selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(33, 26, 23, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '16px'
        }}>
          <div className="card animate-fade-in" style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#211A17', marginBottom: '4px' }}>Write a Review</h3>
            <p style={{ fontSize: '13px', color: '#77716B', marginBottom: '20px' }}>
              For order #{selectedOrder.id} of {selectedOrder.menuItemName} at {selectedOrder.restaurantName}
            </p>

            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#211A17', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Rating
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <Star
                        size={28}
                        fill={(hoverRating || rating) >= star ? '#C96F4A' : 'none'}
                        color={(hoverRating || rating) >= star ? '#C96F4A' : '#E8E2DA'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#211A17', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Comment
                </label>
                <textarea
                  placeholder="Write your review here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #E8E2DA',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, backgroundColor: '#211A17', color: '#FFFFFF', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={closeReviewModal}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
