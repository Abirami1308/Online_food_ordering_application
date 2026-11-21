import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Utensils } from 'lucide-react';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }
    setLoading(true);
    try {
      const loggedUser = await login(username, password);
      toast.success(`Welcome back, ${loggedUser.username}!`);
      if (loggedUser.role?.toUpperCase() === 'ADMIN') {
        onNavigate('/admin');
      } else if (loggedUser.role?.toUpperCase() === 'RESTAURANT') {
        onNavigate('/restaurant/dashboard');
      } else {
        onNavigate('/');
      }
    } catch (err) {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1.1fr 0.9fr', 
      minHeight: '90vh', 
      backgroundColor: '#FFFFFF', 
      overflow: 'hidden', 
      margin: '0 auto', 
      width: '100%' 
    }} className="login-layout animate-fade-in">
      
      {/* Left side Image & Tagline */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=cover&q=80"
          alt="Premium dining experience"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: 'rgba(33, 26, 23, 0.45)', 
          padding: '60px 48px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-end', 
          color: '#FFFFFF' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', marginBottom: '16px' }}>
            <Utensils size={20} />
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.15', marginBottom: '12px' }}>
            Good food. Delivered beautifully.
          </h2>
          <p style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.6', maxWidth: '380px' }}>
            Sign in to track your orders, save favourites, and check out.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#FAF8F5' }}>
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#211A17', marginBottom: '4px' }}>Welcome back</h2>
          <p style={{ color: '#77716B', fontSize: '13px', marginBottom: '32px' }}>
            Log in to continue to Online Food Ordering App
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#211A17', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="input-field"
                style={{ 
                  borderRadius: '6px', 
                  border: '1px solid #E8E2DA', 
                  padding: '10px 14px',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#211A17', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ 
                    borderRadius: '6px', 
                    border: '1px solid #E8E2DA', 
                    padding: '10px 14px',
                    fontSize: '13px',
                    backgroundColor: '#FFFFFF',
                    paddingRight: '40px'
                  }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#77716B',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn" style={{ 
              padding: '12px', 
              marginTop: '12px', 
              backgroundColor: '#C96F4A', 
              color: '#FFFFFF', 
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(201, 111, 74, 0.2)'
            }}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p style={{ fontSize: '12px', color: '#77716B', textAlign: 'center', marginTop: '24px' }}>
            Don't have an account?{' '}
            <span onClick={() => onNavigate('/register')} style={{ color: '#C96F4A', fontWeight: 'bold', cursor: 'pointer' }}>
              Create account
            </span>
          </p>
        </div>
      </div>

    </div>
  );
}
