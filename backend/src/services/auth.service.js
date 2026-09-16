const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

async function register({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash });

  return { user: user.toSafeJSON(), token: signToken(user) };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const matches = await user.comparePassword(password);
  if (!matches) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  return { user: user.toSafeJSON(), token: signToken(user) };
}

async function getById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user.toSafeJSON();
}

module.exports = { register, login, getById, signToken };
