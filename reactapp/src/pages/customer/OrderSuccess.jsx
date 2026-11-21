import React from 'react';

export default function OrderSuccess({ onNavigate }) {
  return (
    <div className="container animate-fade-in" style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '600px' }}>
      <div style={{ width: '64px', height: '64px', backgroundColor: '#FAF8F4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: '#87917B', border: '2px solid #87917B' }}>
        ✓
      </div>
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#211A17', marginBottom: '12px' }}>Your order has been placed!</h2>
      <p style={{ color: '#77716B', fontSize: '15px', marginBottom: '32px' }}>
        Thank you for your purchase. Your food details are submitted and is now being prepared by our kitchen staff.
      </p>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => onNavigate('/orders')} className="btn btn-primary" style={{ padding: '12px 24px' }}>
          Track Orders
        </button>
        <button onClick={() => onNavigate('/')} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
