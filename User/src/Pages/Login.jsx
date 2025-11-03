// skardustay/src/Pages/Login.jsx
import React from 'react'
import "../App.css";

// This is a placeholder for now.
// We will build the login logic when we create the admin panel.
const Login = () => {
  return (
    <div className="add-hotel">
      <h2>Admin Login</h2>
      <form className="add-hotel-form">
        <input
          type="text"
          placeholder="Username"
          defaultValue="mir"
        />
        <input
          type="password"
          placeholder="Password"
          defaultValue="mir123"
        />
        <button type="submit" disabled>
          Login (Coming Soon)
        </button>
      </form>
    </div>
  )
}

export default Login
