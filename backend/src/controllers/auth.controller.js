const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return new ApiResponse(201, result, 'Account created').send(res);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return new ApiResponse(200, result, 'Logged in').send(res);
});

const me = asyncHandler(async (req, res) => {
  return new ApiResponse(200, req.user.toSafeJSON(), 'Current user').send(res);
});

module.exports = { register, login, me };
