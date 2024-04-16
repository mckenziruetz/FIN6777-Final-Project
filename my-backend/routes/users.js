const express = require('express');
const bcrypt = require('bcryptjs'); // or bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Check if user is Admin
router.get('/check-admin', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userData.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === 'admin') {
      return res.json({ isAdmin: true });
    } else {
      return res.status(403).json({ isAdmin: false, message: "Not authorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// User Sign Up Endpoint
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Sign In Endpoint
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
      res.status(200).json({ 
        token,
        firstName: user.firstName,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;