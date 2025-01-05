const express = require('express');
const register = require('../application/register');
const login = require('../application/login');

const router = express.Router();

// Route đăng ký
router.post('/register', async (req, res) => {
  try {
    const user = await register(req.body);
    res.status(201).json({ message: 'Đăng ký thành công', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await login(email, password);
    res.status(200).json({ message: 'Đăng nhập thành công', token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
