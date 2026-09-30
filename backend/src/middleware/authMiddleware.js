import { verifyToken } from '../utils/jwtHelper.js';
import { sendError } from '../utils/responseHelper.js';
import { db } from '../models/database.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. Missing or malformed Bearer token.', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return sendError(res, 'Invalid or expired authentication token.', 401);
  }

  // Look up user profile to verify active status and business tenancy
  const user = await db.findOne('profiles', { id: decoded.userId });
  if (!user) {
    return sendError(res, 'User account associated with token not found.', 401);
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    businessId: user.business_id,
    fullName: user.full_name,
    avatarUrl: user.avatar_url,
  };

  next();
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized. Please authenticate first.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, `Forbidden. Role '${req.user.role}' lacks permission for this resource.`, 403);
    }

    next();
  };
};

export const optionalAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (decoded) {
    const user = await db.findOne('profiles', { id: decoded.userId });
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        businessId: user.business_id,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
      };
    }
  }

  next();
};
