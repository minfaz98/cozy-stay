import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../../config/prisma';
import { env } from '../../config/env';
import { AppError } from '../../middleware/error';
import { Role } from '@prisma/client';
const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
const signTokens = (userId, role) => {
    const payload = { sub: userId, role };
    const access = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
    const refresh = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
    return { access, refresh };
};
export const register = async (req, res) => {
    try {
        const { email, password } = authSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppError(400, 'Email already registered');
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hash, role: Role.CUSTOMER }
        });
        res.status(201).json(signTokens(user.id, user.role));
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, 'Invalid input data');
        }
        throw error;
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = authSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError(401, 'Invalid credentials');
        }
        res.json(signTokens(user.id, user.role));
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new AppError(400, 'Invalid input data');
        }
        throw error;
    }
};
