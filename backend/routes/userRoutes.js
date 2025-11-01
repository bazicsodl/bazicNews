// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path to your User model

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Get all users from DB
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
