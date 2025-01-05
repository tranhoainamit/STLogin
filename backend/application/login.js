const User = require('../domain/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  return { token, user };
};

module.exports = login;
