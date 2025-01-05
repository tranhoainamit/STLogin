const createProfile = require('../application/createProfile');
const puppeteerService = require('../infrastructure/puppeteer/puppeteerService');
const Profile = require('../domain/profile');

// Tạo mới profile
exports.createProfile = async (req, res) => {
  try {
    console.log('Received request to create profile:', req.body); // Log dữ liệu từ frontend
    const profile = await createProfile(req.body);
    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (error) {
    console.error('Error creating profile:', error); // Log lỗi chi tiết
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

// Khởi động profile
exports.startProfile = async (req, res) => {
  const { name } = req.params;

  try {
    const profile = await Profile.findOne({ name });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.status === 'running') {
      return res.status(400).json({ error: 'Profile is already running' });
    }

    await puppeteerService.startProfile(profile);
    profile.status = 'running';
    await profile.save();

    res.status(200).json({ message: 'Profile started successfully' });
  } catch (error) {
    console.error('Error starting profile:', error);
    res.status(500).json({ error: 'Failed to start profile' });
  }
};

// Dừng profile
exports.stopProfile = async (req, res) => {
  const { name } = req.params;

  try {
    const profile = await Profile.findOne({ name });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.status !== 'running') {
      return res.status(400).json({ error: 'Profile is not running' });
    }

    await puppeteerService.stopProfile(profile);
    profile.status = 'stopped';
    await profile.save();

    res.status(200).json({ message: 'Profile stopped successfully' });
  } catch (error) {
    console.error('Error stopping profile:', error);
    res.status(500).json({ error: 'Failed to stop profile' });
  }
};

// Xóa profile
exports.deleteProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await Profile.findByIdAndDelete(id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (fs.existsSync(profile.path)) {
      fs.rmdirSync(profile.path, { recursive: true });
    }

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
};
