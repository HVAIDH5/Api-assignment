const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, address, isAdmin = false } = req.body;
    const user = new User({ username, email, password, address, isAdmin });
    await user.save();
    res.status(201).json({ id: user._id, username: user.username, email: user.email, isAdmin });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/admin/register
router.post('/admin/register', async (req, res) => {
  try {
    const { username, email, password, address } = req.body;
    const user = new User({ username, email, password, address, isAdmin: true });
    await user.save();
    res.status(201).json({ id: user._id, username: user.username, email: user.email, isAdmin: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.userId !== id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.userId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { username, email, address } = req.body;
    const user = await User.findByIdAndUpdate(id, { username, email, address }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;