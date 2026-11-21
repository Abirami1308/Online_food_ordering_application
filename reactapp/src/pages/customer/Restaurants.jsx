import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Phone, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function Restaurants({ onNavigate }) {
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Parse parameters from url
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const cuisineParam = params.get('cuisine');
      const searchParam = params.get('search');
      if (cuisineParam) {
        setSelectedCuisine(cuisineParam);
      } else {
        setSelectedCuisine('');
      }
      if (searchParam) {
        setSearch(searchParam);
      } else {
        setSearch('');
      }
    };

    handleLocationChange();
    fetchRestaurants();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(false);
    try {
      const [restaurantResponse, menuResponse] = await Promise.all([
        api.get('/restaurants'),
        api.get('/menus')
      ]);
      setRestaurants(restaurantResponse.data || []);
      setMenus(menuResponse.data || []);
    } catch (e) {
      setError(true);
      toast.error('Unable to load restaurants.');
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCuisine, selectedRating, sortOption]);

  const filteredAndSortedRestaurants = React.useMemo(() => {
    let result = restaurants.filter((r) => {
      const query = search.trim().toLowerCase();

      let matchesSearch = true;
      if (query) {
        const restaurantMatches =
          (r.name || '').toLowerCase().includes(query) ||
          (r.cuisineType || '').toLowerCase().includes(query) ||
          (r.address || '').toLowerCase().includes(query);

        const menuMatches = menus.some((menu) => {
          if (menu.restaurantId !== r.id) {
            return false;
          }
          return (
            (menu.itemName || '').toLowerCase().includes(query) ||
            (menu.description || '').toLowerCase().includes(query) ||
            (menu.category || '').toLowerCase().includes(query)
          );
        });
        matchesSearch = restaurantMatches || menuMatches;
      }

      const matchesCuisine = selectedCuisine
        ? r.cuisineType === selectedCuisine
        : true;

      let matchesRating = true;
      if (selectedRating) {
        matchesRating = (r.rating || 0) >= parseFloat(selectedRating);
      }

      return matchesSearch && matchesCuisine && matchesRating;
    });

    if (sortOption === 'ratingHighToLow') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === 'ratingLowToHigh') {
      result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    } else if (sortOption === 'nameAToZ') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortOption === 'nameZToA') {
      result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }

    return result;
  }, [restaurants, menus, search, selectedCuisine, selectedRating, sortOption]);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredAndSortedRestaurants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRestaurants = filteredAndSortedRestaurants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisineType))).filter(Boolean);

  if (loading) {
    return (
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E8E2DA', borderTopColor: '#C96F4A', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#211A17' }}>Restaurants</h2>
        <p style={{ fontSize: '13px', color: '#77716B' }}>{filteredAndSortedRestaurants.length} places to explore</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="restaurant-filters-bar" style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: '#77716B' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by restaurant name or cuisine"
            className="input-field"
            style={{ 
              paddingLeft: '48px',
              paddingTop: '10px',
              paddingBottom: '10px',
              borderRadius: '8px',
              border: '1px solid #E8E2DA',
              fontSize: '14px'
            }}
          />
        </div>

        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="input-field"
          style={{ 
            width: '160px',
            paddingTop: '10px',
            paddingBottom: '10px',
            borderRadius: '8px',
            border: '1px solid #E8E2DA',
            fontSize: '14px'
          }}
        >
          <option value="">All cuisines</option>
          {cuisines.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
        
        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="input-field"
          style={{ 
            width: '160px',
            paddingTop: '10px',
            paddingBottom: '10px',
            borderRadius: '8px',
            border: '1px solid #E8E2DA',
            fontSize: '14px'
          }}
        >
          <option value="">Any rating</option>
          <option value="3.5">3.5+</option>
          <option value="4.0">4.0+</option>
          <option value="4.5">4.5+</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="input-field"
          style={{ 
            width: '160px',
            paddingTop: '10px',
            paddingBottom: '10px',
            borderRadius: '8px',
            border: '1px solid #E8E2DA',
            fontSize: '14px'
          }}
        >
          <option value="popular">Popular</option>
          <option value="ratingHighToLow">Rating: High to Low</option>
          <option value="ratingLowToHigh">Rating: Low to High</option>
          <option value="nameAToZ">Name: A to Z</option>
          <option value="nameZToA">Name: Z to A</option>
        </select>
      </div>

      {error ? (
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
          maxWidth: '600px',
          margin: '40px auto'
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
          <button onClick={fetchRestaurants} className="btn" style={{ 
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
      ) : filteredAndSortedRestaurants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <p style={{ color: '#77716B', fontSize: '16px' }}>No restaurants found matching your request.</p>
        </div>
      ) : (
        <div>
          <div className="restaurant-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
            {paginatedRestaurants.map((r) => (
              <div
                key={r.id}
                className="card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=cover&q=80"
                  alt={r.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#211A17' }}>{r.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FAF8F4', padding: '2px 8px', borderRadius: '6px', fontSize: '13px', color: '#C96F4A', fontWeight: 'bold' }}>
                      <Star size={14} fill="#C96F4A" />
                      <span>{r.rating || 'N/A'}</span>
                    </div>
                  </div>

                  <span style={{ fontSize: '13px', color: '#77716B', textTransform: 'uppercase', tracking: 'wider', fontWeight: 'bold', marginBottom: '12px' }}>
                    {r.cuisineType}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#77716B', marginBottom: '20px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} /> {r.address}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} /> {r.phoneNumber}
                    </span>
                  </div>

                  <button onClick={() => onNavigate(`/restaurants/${r.id}`)} className="btn btn-primary" style={{ 
                    width: '100%', 
                    marginTop: 'auto',
                    backgroundColor: '#211A17',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    border: 'none',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}>
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                &larr; Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className="btn"
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    backgroundColor: currentPage === page ? '#211A17' : '#FFFFFF',
                    color: currentPage === page ? '#FFFFFF' : '#211A17',
                    border: '1px solid #E8E2DA',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
