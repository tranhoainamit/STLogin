const fs = require('fs');
const path = require('path');
const Profile = require('../domain/profile');

const profilesDir = path.join(__dirname, '../../profiles');

// Tạo thư mục profiles nếu chưa tồn tại
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir);
}

const createProfile = async (data) => {
  const { name, note, userAgent } = data;

  // Tạo đường dẫn thư mục cho profile
  const profilePath = path.join(profilesDir, name);
  if (!fs.existsSync(profilePath)) {
    fs.mkdirSync(profilePath);
  }

  console.log('Profile path created:', profilePath); // Log kiểm tra

  // Tạo và lưu profile vào MongoDB
  const newProfile = new Profile({
    name,
    note,
    userAgent,
    path: profilePath, // Truyền path vào đúng cách
    status: 'stopped'
  });

  await newProfile.save();
  return newProfile;
};

module.exports = createProfile;
