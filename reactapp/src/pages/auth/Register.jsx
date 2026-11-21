import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Utensils } from 'lucide-react';

export default function Register({ onNavigate }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    role: 'CUSTOMER'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.phoneNumber || !formData.address) {
      toast.error('All fields are required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      // Remove confirmPassword from API request
      const { confirmPassword, ...apiData } = formData;
      await register(apiData);
      toast.success('Registration successful!');
      onNavigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
      
      {/* Left side Image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1000&auto=format&fit=cover&q=80"
          alt="Fresh ingredients on chopping board"
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
            Sign up to track your orders, save favourites, and check out.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div style={{ padding: '60px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#FAF8F5' }}>
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#211A17', marginBottom: '4px' }}>Create your account</h2>
          <p style={{ color: '#77716B', fontSize: '13px', marginBottom: '24px' }}>
            It only takes a minute.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#211A17', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>Username / username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Pick a username"
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

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#211A17', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
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

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#211A17', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>Phone number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
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

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#211A17', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Delivery address"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#211A17', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>Confirm password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn" style={{ 
              padding: '12px', 
              marginTop: '8px', 
              backgroundColor: '#C96F4A', 
              color: '#FFFFFF', 
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(201, 111, 74, 0.2)'
            }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ fontSize: '12px', color: '#77716B', textAlign: 'center', marginTop: '20px' }}>
            Already have an account?{' '}
            <span onClick={() => onNavigate('/login')} style={{ color: '#C96F4A', fontWeight: 'bold', cursor: 'pointer' }}>
              Log in
            </span>
          </p>
        </div>
      </div>

    </div>
  );
}
