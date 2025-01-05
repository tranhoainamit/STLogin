const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  userAgent: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['running', 'stopped'],
    default: 'stopped',
  },
  path: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
