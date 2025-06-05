import jwt from 'jsonwebtoken';
import { AppError } from './error.js';
import { env } from '../config/env.js';

export const authenticate = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(401, 'No token provided');
      }

      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        
        // Add user info to request
        req.user = {
          id: decoded.id, 
          email: decoded.email,
          role: decoded.role
        };

        // Check role if allowedRoles is specified
        if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
          throw new AppError(403, 'Insufficient permissions');
        }

        next();
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          next(new AppError(401, 'Invalid token'));
        } else if (error instanceof jwt.TokenExpiredError) {
          next(new AppError(401, 'Token expired'));
        } else {
          next(error);
        }
      }
    } catch (error) {
      next(error);
    }
  };
}; 