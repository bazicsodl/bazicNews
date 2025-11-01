// routes/email.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');

router.post('/broadcast', async (req, res) => {
  const { subject, message } = req.body;

  try {
    const users = await User.find({}, 'email');
    const emails = users.map(user => user.email);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    await transporter.sendMail({
      from: `"Bazic News" <${process.env.EMAIL_USER}>`,
      to: emails.join(','),
      subject,
      text: message,
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending email' });
  }
});

module.exports = router;
