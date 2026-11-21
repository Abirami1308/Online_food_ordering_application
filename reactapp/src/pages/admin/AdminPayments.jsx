import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/priceFormatter';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data || []);
    } catch (e) {
      toast.error('Unable to fetch payments ledger');
    } finally {
      setLoading(false);
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
      <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#211A17', marginBottom: '8px' }}>Payment Transactions</h2>
      <p style={{ color: '#77716B', marginBottom: '32px' }}>Audit log of processed payments and invoices</p>

      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E2DA', backgroundColor: '#FAF8F4' }}>
              <th style={{ padding: '16px' }}>Payment ID</th>
              <th style={{ padding: '16px' }}>Order ID</th>
              <th style={{ padding: '16px' }}>Transaction ID</th>
              <th style={{ padding: '16px' }}>Amount</th>
              <th style={{ padding: '16px' }}>Payment Mode</th>
              <th style={{ padding: '16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #E8E2DA' }}>
                <td style={{ padding: '16px', fontWeight: '600' }}>#{p.id}</td>
                <td style={{ padding: '16px' }}>#{p.orderId}</td>
                <td style={{ padding: '16px' }}>{p.transactionId}</td>
                <td style={{ padding: '16px' }}>{formatPrice(p.amount)}</td>
                <td style={{ padding: '16px' }}>{p.paymentMode}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ color: p.paymentStatus?.toUpperCase() === 'SUCCESS' ? '#87917B' : '#C96F4A', fontWeight: 'bold' }}>
                    {p.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
