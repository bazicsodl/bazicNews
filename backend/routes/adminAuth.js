// routes/adminAuth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });
  if (!admin || admin.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

 // login route
const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({ token });
});

router.get('/stats', async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const postsCount = await Post.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });

    // Simulate email count (you can add real logic later)
    const emailsSent = postsCount * 3; // example logic

    res.json({
      users: usersCount,
      posts: postsCount,
      admins: adminCount,
      emails: emailsSent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

module.exports = router;
