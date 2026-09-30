import { authService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return sendSuccess(res, result, 'Registration successful', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, result, 'Login successful', 200);
  } catch (err) {
    return sendError(res, err.message, 401);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user.id);
    return sendSuccess(res, result, 'Current user profile retrieved', 200);
  } catch (err) {
    return sendError(res, err.message, 404);
  }
};
