import bcrypt from 'bcryptjs';
import { db } from '../models/database.js';
import { generateToken } from '../utils/jwtHelper.js';
import { logger } from '../utils/logger.js';

export const authService = {
  async register({ fullName, email, password, businessName, role = 'customer' }) {
    const existing = await db.findOne('profiles', { email });
    if (existing) {
      throw new Error('A user with this email address already exists.');
    }

    let businessId = null;
    if (role === 'admin' && businessName) {
      const newBiz = await db.insert('businesses', {
        name: businessName,
        description: `${businessName} CX workspace`,
      });
      businessId = newBiz.id;
    } else {
      // Assign default business or first available
      const businesses = await db.findMany('businesses');
      businessId = businesses[0]?.id || 'b1000000-0000-0000-0000-000000000001';
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const profile = await db.insert('profiles', {
      business_id: businessId,
      full_name: fullName,
      email,
      password_hash: passwordHash,
      role,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
    });

    if (role === 'customer') {
      await db.insert('customers', {
        business_id: businessId,
        name: fullName,
        email,
        preferences: { preferred_channel: 'chat', interests: [] },
      });
    }

    logger.audit('USER_REGISTERED', profile.id, { email, role, businessId });

    const token = generateToken({
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      businessId: profile.business_id,
    });

    return {
      token,
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role,
        businessId: profile.business_id,
        avatarUrl: profile.avatar_url,
      },
    };
  },

  async login({ email, password }) {
    const profile = await db.findOne('profiles', { email });
    if (!profile) {
      throw new Error('Invalid email or password credentials.');
    }

    const isMatch = await bcrypt.compare(password, profile.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password credentials.');
    }

    logger.audit('USER_LOGIN', profile.id, { email: profile.email });

    const token = generateToken({
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      businessId: profile.business_id,
    });

    return {
      token,
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role,
        businessId: profile.business_id,
        avatarUrl: profile.avatar_url,
      },
    };
  },

  async getCurrentUser(userId) {
    const profile = await db.findOne('profiles', { id: userId });
    if (!profile) {
      throw new Error('User not found.');
    }

    const business = await db.findOne('businesses', { id: profile.business_id });

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      role: profile.role,
      businessId: profile.business_id,
      avatarUrl: profile.avatar_url,
      business: business ? { id: business.id, name: business.name, settings: business.settings } : null,
    };
  }
};
