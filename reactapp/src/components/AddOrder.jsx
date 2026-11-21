import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AddOrder({ onOrderAdded }) {
  const [order, setOrder] = useState({
    restaurantName: '',
    cuisineType: '',
    menuItemName: '',
    menuItemDescription: '',
    menuItemPrice: '',
    quantity: '',
    orderStatus: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!order.restaurantName) tempErrors.restaurantName = 'Required';
    if (!order.cuisineType) tempErrors.cuisineType = 'Required';
    if (!order.menuItemName) tempErrors.menuItemName = 'Required';
    if (!order.menuItemDescription) tempErrors.menuItemDescription = 'Required';
    if (!order.menuItemPrice || parseFloat(order.menuItemPrice) <= 0) tempErrors.menuItemPrice = 'Required';
    if (!order.quantity || parseInt(order.quantity) <= 0) tempErrors.quantity = 'Required';
    if (!order.orderStatus) tempErrors.orderStatus = 'Required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = {
        ...order,
        menuItemPrice: parseFloat(order.menuItemPrice),
        quantity: parseInt(order.quantity),
      };
      await api.post('/orders', payload);
      toast.success('Order placed successfully!');
      setOrder({
        restaurantName: '',
        cuisineType: '',
        menuItemName: '',
        menuItemDescription: '',
        menuItemPrice: '',
        quantity: '',
        orderStatus: ''
      });
      if (onOrderAdded) onOrderAdded();
    } catch (err) {
      toast.error('Failed to submit order.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '24px auto', padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2DA', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#211A17' }}>Submit a New Order</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <input
            type="text"
            name="restaurantName"
            value={order.restaurantName}
            onChange={handleChange}
            placeholder="Restaurant Name"
            className="input-field"
          />
          {errors.restaurantName && <span style={{ color: '#C96F4A', fontSize: '12px' }}>{errors.restaurantName}</span>}
        </div>

        <div>
          <input
            type="text"
            name="cuisineType"
            value={order.cuisineType}
            onChange={handleChange}
            placeholder="Cuisine Type"
            className="input-field"
          />
          {errors.cuisineType && <span style={{ color: '#C96F4A', fontSize: '12px' }}>{errors.cuisineType}</span>}
        </div>

        <div>
          <input
            type="text"
            name="menuItemName"
            value={order.menuItemName}
            onChange={handleChange}
            placeholder="Menu Item Name"
            className="input-field"
          />
          {errors.menuItemName && <span style={{ color: '#C96F4A', fontSize: '12px' }}>{errors.menuItemName}</span>}
        </div>

        <div>
          <input
            type="text"
            name="menuItemDescription"
            value={order.menuItemDescription}
            onChange={handleChange}
            placeholder="Item Description"
            className="input-field"
          />
          {errors.menuItemDescription && <span style={{ color: '#C96F4A', fontSize: '12px' }}>{errors.menuItemDescription}</span>}
        </div>

        <div>
          <input
            type="number"
            step="0.01"
            name="menuItemPrice"
            value={order.menuItemPrice === '' ? '' : order.menuItemPrice}
            onChange={handleChange}
            placeholder="Price"
            className="input-field"
          />
          {errors.menuItemPrice && <span style={{ color: '#C96F4A', fontSize: '12px' }}>{errors.menuItemPrice}</span>}
        </div>

        <div>
          <input
            type="number"
            name="quantity"
            value={order.quantity === '' ? '' : order.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="input-field"
          />
          {errors.quantity && <span style={{ color: '#C96F4A', fontSize: '12px' }}>{errors.quantity}</span>}
        </div>

        <div>
          <input
            type="text"
            name="orderStatus"
            value={order.orderStatus}
            onChange={handleChange}
            placeholder="Order Status"
            className="input-field"
          />
          {errors.orderStatus && <span style={{ color: '#C96F4A', fontSize: '12px' }}>{errors.orderStatus}</span>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
          Submit Order
        </button>
      </form>
    </div>
  );
}
