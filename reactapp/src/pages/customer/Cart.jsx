import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/priceFormatter';

export default function Cart({ onNavigate }) {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const deliveryFee = cartItems.length > 0 ? 5.00 : 0;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + deliveryFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#211A17', marginBottom: '12px' }}>Your Cart</h2>
        <p style={{ color: '#77716B', marginBottom: '24px' }}>Your cart is waiting for something delicious.</p>
        <button onClick={() => onNavigate('/restaurants')} className="btn btn-primary">
          Explore Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#211A17', marginBottom: '32px' }}>Your Cart</h2>

      <div className="cart-layout-grid" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2DA' }}
            >
              <div>
                <h4 style={{ fontWeight: '700', color: '#211A17' }}>{item.itemName}</h4>
                <p style={{ fontSize: '13px', color: '#77716B' }}>{formatPrice(item.price)} each</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E8E2DA', borderRadius: '6px', padding: '4px 8px', backgroundColor: '#FAF8F4' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#C96F4A', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="btn btn-secondary" style={{ alignSelf: 'flex-start', color: '#C96F4A', borderColor: '#C96F4A' }}>
            Clear Cart
          </button>
        </div>

        {/* Summary Card */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', borderBottom: '1px solid #E8E2DA', paddingBottom: '12px', marginBottom: '16px' }}>Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#77716B', borderBottom: '1px solid #E8E2DA', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery Fee</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Taxes (8%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '16px', color: '#211A17', marginBottom: '24px' }}>
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
          <button onClick={() => onNavigate('/checkout')} className="btn btn-primary" style={{ width: '100%' }}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
