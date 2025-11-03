// backend/routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin Login
// In a real app, you'd check this against a database.
// As per your request, we'll hardcode the credentials.
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'mir' && password === 'mir123') {
    // Correct credentials
    // Create a token
    const token = jwt.sign(
      { username: 'mir', role: 'admin' }, // payload
      process.env.JWT_SECRET, // secret key from .env
      { expiresIn: '8h' } // token expires in 8 hours
    );

    res.json({ message: 'Login successful', token });
  } else {
    // Invalid credentials
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

export default router;


