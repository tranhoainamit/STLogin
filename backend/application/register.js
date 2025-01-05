const User = require('../domain/user');

const register = async (userData) => {
  const { username, email, password } = userData;

  // Kiểm tra trùng lặp email hoặc username
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('Email hoặc username đã được sử dụng');
  }

  const user = new User({ username, email, password });
  await user.save();
  return user;
};

module.exports = register;
