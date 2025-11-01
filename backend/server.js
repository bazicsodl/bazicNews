const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cron = require('node-cron');
const moment = require('moment-timezone');

require('dotenv').config();

const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const { seedNews } = require('./seedNews');

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret', // store in .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: false // Set true if using HTTPS
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
  console.log('Server time:', new Date());
  console.log('Timezone offset:', new Date().getTimezoneOffset());

  // Initial fetch
  try {
    console.log('Running initial news fetch...');
    await seedNews();
  } catch (error) {
    console.error('Initial fetch failed:', error);
  }

  // Scheduled daily fetch at 6 AM in specified timezone
  let isFetching = false;
  cron.schedule('0 * * * *', async () => {
    if (isFetching) {
      console.log('Fetch already in progress, skipping...');
      return;
    }
    
    isFetching = true;
    try {
      console.log('Running scheduled news fetch at:', moment().tz('America/New_York').format());
      await seedNews();
    } catch (error) {
      console.error('Scheduled fetch failed:', error);
      // Consider adding retry logic here
    } finally {
      isFetching = false;
    }
  }, {
    scheduled: true,
    timezone: "America/New_York" // Set your preferred timezone
  });

  app.listen(2500, () => console.log('Server running on port 2500'));
}).catch(err => console.error('MongoDB connection error:', err));