import { query } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production-env-mutmainna';

export async function verifyAdminCredentials(email, password) {
  try {
    // In production, you should have an admin users table
    // For now, using environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tahinihouse.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Check if admin exists in database (optional)
    const admin = await query(
      'SELECT * FROM admin_users WHERE email = ?',
      [email]
    );
    
    if (admin.length > 0) {
      const isValid = await bcrypt.compare(password, admin[0].password_hash);
      if (isValid) {
        return { success: true, user: admin[0] };
      }
    }
    
    // Fallback to environment variables
    if (email === adminEmail && password === adminPassword) {
      return { success: true, user: { email: adminEmail, name: 'Admin' } };
    }
    
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    console.error('Auth error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id || 1,
      email: user.email,
      name: user.name || 'Admin'
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}