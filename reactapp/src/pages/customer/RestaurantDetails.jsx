import React, { useState, useEffect } from 'react';
import { Star, MapPin, Phone, ShoppingBag } from 'lucide-react';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/priceFormatter';

export default function RestaurantDetails({ onNavigate }) {
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const id = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [restRes, menuRes, reviewsRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get('/menus'),
          api.get(`/reviews/restaurant/${id}`)
        ]);
        setRestaurant(restRes.data);
        
        const filteredMenus = (menuRes.data || []).filter((m) => String(m.restaurantId) === String(id));
        setMenus(filteredMenus);
        
        setReviews(reviewsRes.data || []);
      } catch (e) {
        toast.error('Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E8E2DA', borderTopColor: '#211A17', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p>Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Restaurant Header */}
      <div style={{ backgroundColor: '#FAF8F4', borderBottom: '1px solid #E8E2DA', padding: '48px 24px' }}>
        <div className="container restaurant-details-header" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', tracking: 'wider', color: '#C96F4A', fontWeight: 'bold' }}>{restaurant.cuisineType}</span>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#211A17', marginTop: '8px' }}>{restaurant.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', fontSize: '14px', color: '#77716B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#C96F4A', fontWeight: 'bold' }}>
                <Star size={16} fill="#C96F4A" />
                <span>{restaurant.rating || 'N/A'}</span>
              </div>
              <span>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} /> {restaurant.address}
              </span>
              <span>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={16} /> {restaurant.phoneNumber}
              </span>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=cover&q=80"
              alt={restaurant.name}
              style={{ width: '100%', height: '240px', borderRadius: '16px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* Menu items grid */}
      <div className="container" style={{ marginTop: '40px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#211A17', marginBottom: '24px' }}>Menu Cards</h2>

        {menus.length === 0 ? (
          <p style={{ color: '#77716B' }}>No menu items available at the moment.</p>
        ) : (
          <div className="menu-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {menus.map((menu) => (
              <div key={menu.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#211A17', marginBottom: '6px' }}>{menu.itemName}</h3>
                <p style={{ fontSize: '13px', color: '#77716B', flex: 1, marginBottom: '16px' }}>{menu.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#211A17' }}>{formatPrice(menu.price)}</span>
                  <button
                    onClick={() => addToCart(menu)}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ShoppingBag size={14} /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Restaurant Reviews Section */}
      <div className="container" style={{ marginTop: '56px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#211A17', marginBottom: '24px', borderTop: '1px solid #E8E2DA', paddingTop: '40px' }}>
          Customer Reviews
        </h2>

        {reviews.length === 0 ? (
          <p style={{ color: '#77716B', fontStyle: 'italic' }}>No reviews yet for this restaurant.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reviews.map((rev) => {
              const dateStr = rev.reviewDate ? new Date(rev.reviewDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }) : '';

              return (
                <div key={rev.id} className="card" style={{ padding: '20px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2DA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < rev.rating ? '#C96F4A' : 'none'}
                          color={i < rev.rating ? '#C96F4A' : '#E8E2DA'}
                        />
                      ))}
                    </div>
                    {dateStr && <span style={{ fontSize: '11px', color: '#A09A95' }}>{dateStr}</span>}
                  </div>
                  <p style={{ fontSize: '13px', color: '#554E4A', margin: 0, fontStyle: 'italic' }}>
                    "{rev.comment}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
