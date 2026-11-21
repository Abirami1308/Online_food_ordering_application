import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Layers, MapPin, Search, AlertTriangle } from 'lucide-react';
import api from '../utils/api';

export default function Home({ onNavigate }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFeaturedRestaurants();
  }, []);

  const fetchFeaturedRestaurants = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/restaurants');
      // Limit to 3 restaurants for home page featured section
      setFeatured((response.data || []).slice(0, 3));
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (onNavigate) {
      if (query) {
        onNavigate(`/restaurants?search=${encodeURIComponent(query)}`);
      } else {
        onNavigate('/restaurants');
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '64px', backgroundColor: '#FAF8F5' }}>
      
      {/* Hero Section */}
      <section style={{ padding: '60px 24px', position: 'relative' }}>
        <div className="container hero-container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Hero */}
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '6px 16px', 
              borderRadius: '20px', 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E8E2DA',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#77716B',
              marginBottom: '24px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <span>✨</span> Fresh picks near you
            </div>
            
            <h1 className="hero-heading" style={{ 
              fontSize: '52px', 
              fontWeight: '800', 
              color: '#211A17', 
              lineHeight: '1.08',
              letterSpacing: '-1.5px',
              marginBottom: '20px'
            }}>
              Good food.<br />Delivered beautifully.
            </h1>
            
            <p style={{ 
              color: '#77716B', 
              fontSize: '15px', 
              lineHeight: '1.6',
              maxWidth: '460px',
              marginBottom: '32px'
            }}>
              Discover restaurants, explore menus, and get your favourite meals delivered to your door.
            </p>

            {/* Hero Search Box */}
            <form onSubmit={handleSearchSubmit} className="hero-search-form" style={{ 
              display: 'flex', 
              backgroundColor: '#FFFFFF', 
              borderRadius: '30px', 
              padding: '4px 6px 4px 18px', 
              border: '1px solid #E8E2DA',
              boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
              maxWidth: '480px',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <Search size={16} style={{ color: '#A09A95', marginRight: '10px' }} />
              <input 
                type="text" 
                placeholder="Search restaurants or dishes" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="hero-search-input"
                style={{ 
                  border: 'none', 
                  outline: 'none', 
                  flex: 1, 
                  fontSize: '14px', 
                  color: '#211A17' 
                }}
              />
              <button type="submit" className="btn hero-search-btn" style={{ 
                backgroundColor: '#C96F4A', 
                color: '#FFFFFF', 
                borderRadius: '20px', 
                padding: '10px 24px', 
                border: 'none',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                Find food &rarr;
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#77716B', fontSize: '12px' }}>
              <MapPin size={14} style={{ color: '#A09A95' }} />
              <span>Delivering across Coimbatore</span>
            </div>
          </div>

           {/* Right Hero Image */}
          <div className="hero-image-container" style={{ position: 'relative' }}>
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=cover&q=80" 
              alt="Plated meal curation" 
              style={{ 
                width: '100%', 
                height: '380px', 
                borderRadius: '16px', 
                objectFit: 'cover',
                boxShadow: '0 10px 30px rgba(33, 26, 23, 0.1)'
              }}
            />
            {/* Delivery Time Badge overlay */}
            <div style={{ 
              position: 'absolute', 
              bottom: '24px', 
              left: '24px', 
              backgroundColor: '#FFFFFF', 
              padding: '12px 18px', 
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #FAF8F5'
            }}>
              <span style={{ fontSize: '10px', color: '#77716B', display: 'block', fontWeight: 'bold' }}>Delivered in</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#211A17' }}>25&ndash;35 min</span>
            </div>
          </div>

        </div>
      </section>

      {/* Trust Badges Grid */}
      <section style={{ padding: '24px 24px 48px 24px' }}>
        <div className="container trust-badges-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {/* Card 1 */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #E8E2DA', 
            borderRadius: '12px', 
            padding: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
          }}>
            <div style={{ color: '#87917B', marginTop: '2px' }}><ShieldCheck size={24} /></div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#211A17', marginBottom: '4px' }}>Trusted restaurants</h4>
              <p style={{ fontSize: '12px', color: '#77716B', lineHeight: '1.5' }}>Curated partners with consistent quality.</p>
            </div>
          </div>
          {/* Card 2 */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #E8E2DA', 
            borderRadius: '12px', 
            padding: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
          }}>
            <div style={{ color: '#87917B', marginTop: '2px' }}><Clock size={24} /></div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#211A17', marginBottom: '4px' }}>On-time delivery</h4>
              <p style={{ fontSize: '12px', color: '#77716B', lineHeight: '1.5' }}>Live tracking from kitchen to your door.</p>
            </div>
          </div>
          {/* Card 3 */}
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #E8E2DA', 
            borderRadius: '12px', 
            padding: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
          }}>
            <div style={{ color: '#87917B', marginTop: '2px' }}><Layers size={24} /></div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#211A17', marginBottom: '4px' }}>Handpicked menus</h4>
              <p style={{ fontSize: '12px', color: '#77716B', lineHeight: '1.5' }}>Discover dishes worth reordering.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section style={{ padding: '24px 24px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#211A17', marginBottom: '4px' }}>Featured restaurants</h2>
              <p style={{ fontSize: '13px', color: '#77716B' }}>Popular picks from our marketplace.</p>
            </div>
            <button onClick={() => onNavigate('/restaurants')} className="btn" style={{ 
              border: '1px solid #E8E2DA', 
              backgroundColor: '#FFFFFF', 
              color: '#554E4A',
              padding: '6px 16px',
              fontSize: '12px',
              borderRadius: '6px',
              fontWeight: '600'
            }}>
              View all
            </button>
          </div>

          {/* Loading, Error or Content states */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid #E8E2DA', borderTopColor: '#C96F4A', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : error ? (
            /* Custom Error Card matching screenshots */
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E8E2DA', 
              borderRadius: '12px', 
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
            }}>
              <div style={{ 
                backgroundColor: '#FFF2F2', 
                color: '#E53E3E', 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#211A17', marginBottom: '6px' }}>Something went wrong</h3>
              <p style={{ fontSize: '13px', color: '#77716B', marginBottom: '20px' }}>Our server had a problem. Please try again shortly.</p>
              <button onClick={fetchFeaturedRestaurants} className="btn" style={{ 
                border: '1px solid #E8E2DA', 
                backgroundColor: '#FFFFFF', 
                color: '#211A17',
                padding: '8px 20px',
                fontSize: '13px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Try again
              </button>
            </div>
          ) : (
            <div className="restaurant-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
              {featured.map((r) => (
                <div key={r.id} className="card" onClick={() => onNavigate(`/restaurants/${r.id}`)} style={{ 
                  cursor: 'pointer',
                  overflow: 'hidden',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E8E2DA'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=cover&q=80" 
                    alt={r.name} 
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#211A17' }}>{r.name}</h4>
                      <span style={{ fontSize: '12px', color: '#C96F4A', fontWeight: 'bold' }}>⭐ {r.rating || 'N/A'}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#77716B', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '12px' }}>{r.cuisineType}</p>
                    <p style={{ fontSize: '12px', color: '#77716B' }}>📍 {r.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
