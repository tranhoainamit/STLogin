const express = require('express');
const router = express.Router();
const userAgents = require('../../config/userAgents');

// API để random User-Agent
router.get('/random', (req, res) => {
  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  res.json({ userAgent: randomUserAgent });
});

module.exports = router;
