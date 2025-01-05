const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route: Tạo mới profile
router.post('/', profileController.createProfile);

// Route: Lấy danh sách profiles
router.get('/', profileController.getProfiles);

// Route: Cập nhật profile
router.put('/:id', profileController.updateProfile);

// Route: Xóa profile
router.delete('/:id', profileController.deleteProfile);

// Route: Khởi động profile
router.post('/:name/start', profileController.startProfile);

// Route: Dừng profile
router.post('/:name/stop', profileController.stopProfile);

module.exports = router;
