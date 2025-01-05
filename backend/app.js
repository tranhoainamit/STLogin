const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./infrastructure/db/mongoose');
const authRoutes = require('./interfaces/authController');
const profileRoutes = require('./interfaces/profileController');
const userAgentRoutes = require('./interfaces/userAgentController');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Định nghĩa các route
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/user-agent', userAgentRoutes);


// Kết nối MongoDB
connectDB();

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
