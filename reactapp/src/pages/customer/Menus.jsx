import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/priceFormatter';

export default function Menus({ onNavigate }) {
  const [menus, setMenus] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [sortOption, setSortOption] = useState('nameAToZ');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    setError(false);
    try {
      const [menuRes, restRes] = await Promise.all([
        api.get('/menus'),
        api.get('/restaurants')
      ]);
      setMenus(menuRes.data || []);
      setRestaurants(restRes.data || []);
    } catch (e) {
      setError(true);
      toast.error('Unable to load menus');
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, selectedPrice, sortOption]);

  const filteredAndSortedMenus = React.useMemo(() => {
    let result = menus.filter((m) => {
      const query = search.trim().toLowerCase();

      let matchesSearch = true;
      if (query) {
        const rest = restaurants.find((r) => r.id === m.restaurantId);
        const restName = rest ? rest.name : '';
        matchesSearch =
          (m.itemName || '').toLowerCase().includes(query) ||
          (m.description || '').toLowerCase().includes(query) ||
          (m.category || '').toLowerCase().includes(query) ||
          restName.toLowerCase().includes(query);
      }

      const matchesCat = category ? m.category === category : true;

      let matchesPrice = true;
      if (selectedPrice === 'under100') {
        matchesPrice = m.price < 100;
      } else if (selectedPrice === '100to200') {
        matchesPrice = m.price >= 100 && m.price <= 200;
      } else if (selectedPrice === '200to300') {
        matchesPrice = m.price > 200 && m.price <= 300;
      } else if (selectedPrice === 'above300') {
        matchesPrice = m.price > 300;
      }

      return matchesSearch && matchesCat && matchesPrice;
    });

    if (sortOption === 'nameAToZ') {
      result.sort((a, b) => (a.itemName || '').localeCompare(b.itemName || ''));
    } else if (sortOption === 'nameZToA') {
      result.sort((a, b) => (b.itemName || '').localeCompare(a.itemName || ''));
    } else if (sortOption === 'priceLowToHigh') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === 'priceHighToLow') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [menus, restaurants, search, category, selectedPrice, sortOption]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredAndSortedMenus.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMenus = filteredAndSortedMenus.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const categories = Array.from(new Set(menus.map((m) => m.category))).filter(Boolean);

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
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#211A17' }}>Menu</h2>
        <p style={{ fontSize: '13px', color: '#77716B' }}>Should dishes across every restaurant on Savora</p>
      </div>

      {/* Filter and Search */}
      <div className="menu-filters-bar" style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: '#77716B' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menus"
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
          <option value="">All categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
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
          <option value="">All prices</option>
          <option value="under100">Under ₹100</option>
          <option value="100to200">₹100 – ₹200</option>
          <option value="200to300">₹200 – ₹300</option>
          <option value="above300">Above ₹300</option>
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
          <option value="nameAToZ">Name: A to Z</option>
          <option value="nameZToA">Name: Z to A</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
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
          <button onClick={fetchMenus} className="btn" style={{ 
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
      ) : filteredAndSortedMenus.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <p style={{ color: '#77716B' }}>No dishes found.</p>
        </div>
      ) : (
        <div>
          <div className="menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
            {paginatedMenus.map((item) => {
              const restName = restaurants.find((r) => r.id === item.restaurantId)?.name || '';
              return (
                <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=cover&q=80"
                    alt={item.itemName}
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#211A17', marginBottom: '4px' }}>{item.itemName}</h3>
                    {restName && (
                      <span style={{ fontSize: '12px', color: '#77716B', marginBottom: '6px', fontWeight: '500' }}>
                        by {restName}
                      </span>
                    )}
                    <span style={{ display: 'inline-block', fontSize: '11px', textTransform: 'uppercase', color: '#C96F4A', fontWeight: 'bold', marginBottom: '8px' }}>
                      {item.category}
                    </span>
                    <p style={{ fontSize: '13px', color: '#77716B', flex: 1, marginBottom: '16px' }}>{item.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: '#211A17' }}>{formatPrice(item.price)}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="btn btn-primary"
                        style={{ 
                          padding: '8px 16px', 
                          fontSize: '13px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          backgroundColor: '#211A17',
                          color: '#FFFFFF',
                          borderRadius: '6px',
                          border: 'none',
                          fontWeight: 'bold'
                        }}
                      >
                        <ShoppingBag size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
