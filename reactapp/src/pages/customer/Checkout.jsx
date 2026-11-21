import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';
import { formatPrice } from '../../utils/priceFormatter';

export default function Checkout({ onNavigate }) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = 5.00;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + deliveryFee + tax;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/users/me');
        if (res.data) {
          setAddress(res.data.address || '');
          setPhone(res.data.phoneNumber || '');
        }
      } catch (e) {
        console.error('Failed to load user info', e);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !phone) {
      toast.error('Please fill in all details');
      return;
    }
    setSubmitting(true);
    try {
      // Simulate ordering by building individual items into the database orders
      for (const item of cartItems) {
        const orderPayload = {
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName || 'Restaurant Curation',
          cuisineType: item.category || 'Main Course',
          menuItemName: item.itemName,
          menuItemDescription: item.description,
          menuItemPrice: item.price,
          quantity: item.quantity,
          orderStatus: 'Placed',
          paymentMode: paymentMode
        };
        await api.post('/orders', orderPayload);
      }
      clearCart();
      toast.success('Order placed successfully!');
      onNavigate('/order-success');
    } catch (err) {
      toast.error('Order checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#211A17', marginBottom: '24px' }}>Checkout</h2>

      <form onSubmit={handleSubmit} className="checkout-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#211A17', borderBottom: '1px solid #E8E2DA', paddingBottom: '8px' }}>Delivery Details</h3>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Delivery Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address"
              className="input-field"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Contact Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="input-field"
              required
            />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#211A17', borderBottom: '1px solid #E8E2DA', paddingBottom: '8px', marginTop: '12px' }}>Payment Mode</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['UPI', 'Card', 'Cash on Delivery'].map((mode) => (
              <label key={mode} style={{ flex: 1, padding: '12px', border: '1px solid #E8E2DA', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', backgroundColor: paymentMode === mode ? '#FAF8F4' : '#FFFFFF', borderColor: paymentMode === mode ? '#C96F4A' : '#E8E2DA' }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMode === mode}
                  onChange={() => setPaymentMode(mode)}
                  style={{ accentColor: '#C96F4A' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{mode}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary Panel */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#211A17', borderBottom: '1px solid #E8E2DA', paddingBottom: '12px', marginBottom: '16px' }}>Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#77716B', borderBottom: '1px solid #E8E2DA', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items Total</span>
              <span style={{ color: '#211A17', fontWeight: '600' }}>{formatPrice(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery Fee</span>
              <span style={{ color: '#87917B', fontWeight: '600' }}>{formatPrice(deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>GST & Restaurant Charges (8%)</span>
              <span style={{ color: '#211A17', fontWeight: '600' }}>{formatPrice(tax)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#211A17' }}>Grand Total</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#C96F4A' }}>{formatPrice(grandTotal)}</span>
          </div>
          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%' }}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
