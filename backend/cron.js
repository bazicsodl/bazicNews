require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const moment = require('moment-timezone');
const { seedNews } = require('./seedNews');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("Cron Worker: MongoDB connected");

  // Run immediately when worker starts
  try {
    console.log('Cron Worker: Running initial fetch...');
    await seedNews();
  } catch (err) {
    console.error('Initial fetch failed:', err);
  }

  // Run the job every hour (same as your server logic)
  let isFetching = false;
  cron.schedule('0 * * * *', async () => {
    if (isFetching) {
      console.log('Fetch already running, skipping...');
      return;
    }

    isFetching = true;
    try {
      console.log('Cron Worker: Running scheduled fetch at: ', moment().tz('America/New_York').format());
      await seedNews();
    } catch (err) {
      console.error('Scheduled fetch failed:', err);
    } finally {
      isFetching = false;
    }
  }, {
    timezone: "America/New_York"
  });

})
.catch(err => console.error("Cron Worker: MongoDB connection error:", err));
