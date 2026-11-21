import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data || []);
    } catch (e) {
      toast.error('Unable to fetch users list');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (e) {
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #E8E2DA', borderTopColor: '#211A17', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }} className="animate-fade-in">
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#211A17', marginBottom: '8px' }}>User Accounts</h2>
      <p style={{ color: '#77716B', marginBottom: '32px' }}>Manage customer profiles and credentials</p>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E2DA', backgroundColor: '#FAF8F4' }}>
              <th style={{ padding: '16px' }}>Username</th>
              <th style={{ padding: '16px' }}>Email</th>
              <th style={{ padding: '16px' }}>Phone</th>
              <th style={{ padding: '16px' }}>Address</th>
              <th style={{ padding: '16px' }}>Role</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #E8E2DA' }}>
                <td style={{ padding: '16px', fontWeight: '600' }}>{u.username}</td>
                <td style={{ padding: '16px' }}>{u.email}</td>
                <td style={{ padding: '16px' }}>{u.phoneNumber || 'N/A'}</td>
                <td style={{ padding: '16px' }}>{u.address || 'N/A'}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FAF8F4', color: '#C96F4A', border: '1px solid #E8E2DA' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(u.id)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px', borderColor: '#C96F4A', color: '#C96F4A' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
