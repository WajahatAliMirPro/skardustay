// Admin/src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../api.js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // On load, if we have a token, we are "authenticated"
    // In a real app, you might want to verify this token with the backend
    if (token) {
      setIsAuthenticated(true);
      setUser({ username: 'mir' }); // Mock user object based on token
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Login successful
      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      setUser({ username: 'mir' });
      setLoading(false);
      navigate('/'); // Redirect to dashboard
    } catch (err) {
      setAuthError(err.message);
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, authError, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

