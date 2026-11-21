import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { username, password });
      const { token: jwtToken, role, restaurantId } = response.data;
      const loggedUser = { username, role, restaurantId };
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setToken(jwtToken);
      setUser(loggedUser);
      setIsAuthenticated(true);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/register', userData);
      const { token: jwtToken, username, role, restaurantId } = response.data;
      const loggedUser = { username, role, restaurantId };
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setToken(jwtToken);
      setUser(loggedUser);
      setIsAuthenticated(true);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
