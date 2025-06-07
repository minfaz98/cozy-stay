import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/error.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['CUSTOMER', 'COMPANY', 'MANAGER', 'USER']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const signTokens = (userId, role) => {
  const payload = { sub: userId, role };
  const access = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
  return { access, refresh };
};

export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name, role } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'CUSTOMER'
      }
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from response
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.status(201).json({
      status: 'success',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(400, 'Invalid registration data'));
    } else {
      next(error);
    }
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from response
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.json({
      status: 'success',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(400, 'Invalid login data'));
    } else {
      next(error);
    }
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Remove password from response
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.json({
      status: 'success',
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
}; 

// --- ADD THIS NEW CONTROLLER FUNCTION ---
export const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.query; // Get email from query parameter (e.g., /users/by-email?email=test@example.com)

    if (!email) {
      return next(new AppError(400, "Email query parameter is required."));
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true }, // Select necessary fields, including id
    });

    if (!user) {
      // If user is not found, return a 404 error
      return next(new AppError(404, "User not found with the provided email."));
    }

    // Return only necessary user info, without sensitive data like password hash
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.status(200).json({ status: 'success', data: userResponse });
  } catch (error) {
    console.error('Error in getUserByEmail controller:', error);
    next(new AppError(500, "Failed to fetch user by email."));
  }
};