const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const { seedNews } = require('./seedNews');

const app = express();

app.use(cors({
  origin: [
    'https://your-frontend-url-here', 
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: false 
  }
}));

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', require('./routes/adminAuth'));
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected');

  // Initial fetch when server boots
  try {
    console.log('Running initial news fetch...');
    await seedNews();
  } catch (error) {
    console.error('Initial fetch failed:', error);
  }

  const PORT = process.env.PORT || 2500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('MongoDB connection error:', err));
