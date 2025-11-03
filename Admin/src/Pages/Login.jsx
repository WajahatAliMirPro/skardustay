// Admin/src/Pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import "../App.css"; // Reusing styles from App.css

const Login = () => {
  const [username, setUsername] = useState('mir'); // Pre-fill for convenience
  const [password, setPassword] = useState('mir123'); // Pre-fill for convenience
  const { login, isAuthenticated, authError, loading } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      return;
    }
    login(username, password);
  };

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {authError && <p className="status error">{authError}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;

