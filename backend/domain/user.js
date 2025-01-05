const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'active' }, // active hoặc blocked
  role: { type: Number, default: 1 }, // 1: user, 2: mod, 3: admin
  img: { type: String, default: '' },
  try_time: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // Dùng thử 1 ngày
  max_profiles: { type: Number, default: 1 }, // Số profile tối đa
  create_time: { type: Date, default: Date.now },
  update_time: { type: Date, default: Date.now },
});

// Hàm hash mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
