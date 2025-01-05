const express = require('express');
const router = express.Router();
const Profile = require('../domain/profile');
const fs = require('fs');
const path = require('path');
const userAgents = require('../../config/userAgents');

// Đường dẫn thư mục lưu trữ profiles
const profilesDir = path.join(__dirname, '../../profiles');

// Tạo thư mục profiles nếu chưa tồn tại
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

// API random User-Agent
router.get('/user-agent/random', (req, res) => {
  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  res.status(200).json({ userAgent: randomUserAgent });
});

// Lấy danh sách tất cả profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// Tạo mới profile
router.post('/', async (req, res) => {
  try {
    const { name, note, userAgent } = req.body;

    if (!userAgent) {
      return res.status(400).json({ error: 'User-Agent is required' });
    }

    // Kiểm tra nếu profile với cùng tên đã tồn tại
    const existingProfile = await Profile.findOne({ name });
    if (existingProfile) {
      return res.status(400).json({ error: 'Profile name already exists' });
    }

    const newProfile = new Profile({ name, note, userAgent });
    await newProfile.save();

    // Kiểm tra và tạo thư mục riêng cho profile theo ID
    const profilePath = path.join(profilesDir, newProfile._id.toString());
    if (!fs.existsSync(profilePath)) {
      fs.mkdirSync(profilePath, { recursive: true });
      fs.mkdirSync(path.join(profilePath, 'session'));
      fs.mkdirSync(path.join(profilePath, 'cookies'));
      fs.mkdirSync(path.join(profilePath, 'extensions'));
      fs.mkdirSync(path.join(profilePath, 'history'));
    }

    res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Cập nhật profile
// Cập nhật profile
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, note, userAgent } = req.body;
  
      // Kiểm tra định dạng ID
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid profile ID format' });
      }
  
      // Kiểm tra nếu profile không tồn tại
      const existingProfile = await Profile.findById(id);
      if (!existingProfile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
  
      if (!userAgent) {
        return res.status(400).json({ error: 'User-Agent is required' });
      }
  
      const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { name, note, userAgent },
        { new: true, runValidators: true }
      );
  
      res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });
  

// Xóa profile
router.delete('/:id', async (req, res) => {
  try {
    const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Xóa thư mục profile tương ứng
    const profilePath = path.join(profilesDir, req.params.id);
    if (fs.existsSync(profilePath)) {
      fs.rmSync(profilePath, { recursive: true, force: true });
    }

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

module.exports = router;
