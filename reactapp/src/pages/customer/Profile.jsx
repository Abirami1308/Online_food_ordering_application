import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function Profile({ onNavigate }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    role: 'CUSTOMER'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        // Find the user object by hitting raw list (or simulating by matching storage username)
        const listResponse = await api.get('/users');
        const found = (listResponse.data || []).find((u) => u.username === user.username);
        if (found) {
          setProfile(found);
          setFormData({
            username: found.username || '',
            email: found.email || '',
            phoneNumber: found.phoneNumber || '',
            address: found.address || '',
            role: found.role || 'CUSTOMER'
          });
        }
      } catch (e) {
        toast.error('Unable to fetch profile details');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/${profile.id}`, { ...profile, ...formData });
      setProfile(response.data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile details');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E8E2DA', borderTopColor: '#211A17', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p>No profile details found. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#211A17', marginBottom: '8px' }}>Your Profile</h2>
      <p style={{ color: '#77716B', marginBottom: '32px' }}>Manage personal details and addresses</p>

      {editing ? (
        <form onSubmit={handleUpdate} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Username</label>
            <input
              type="text"
              value={formData.username}
              disabled
              className="input-field"
              style={{ backgroundColor: '#FAF8F4', cursor: 'not-allowed' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Phone Number</label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#292522', marginBottom: '6px' }}>Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
              Save Changes
            </button>
            <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary" style={{ padding: '10px 20px' }}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', marginBottom: '24px' }}>
            <div>
              <span style={{ color: '#77716B', display: 'block', marginBottom: '2px' }}>Username</span>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#211A17' }}>{profile.username}</span>
            </div>
            <div>
              <span style={{ color: '#77716B', display: 'block', marginBottom: '2px' }}>Email Address</span>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#211A17' }}>{profile.email}</span>
            </div>
            <div>
              <span style={{ color: '#77716B', display: 'block', marginBottom: '2px' }}>Phone Number</span>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#211A17' }}>{profile.phoneNumber || 'N/A'}</span>
            </div>
            <div>
              <span style={{ color: '#77716B', display: 'block', marginBottom: '2px' }}>Delivery Address</span>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#211A17' }}>{profile.address || 'N/A'}</span>
            </div>
            <div>
              <span style={{ color: '#77716B', display: 'block', marginBottom: '2px' }}>Account Role</span>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#FAF8F4', color: '#C96F4A', border: '1px solid #E8E2DA', marginTop: '4px' }}>
                {profile.role}
              </span>
            </div>
          </div>
          <button onClick={() => setEditing(true)} className="btn btn-primary">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
