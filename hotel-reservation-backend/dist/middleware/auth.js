import jwt from 'jsonwebtoken';
import { env } from '../config/env';
export const authenticate = (roles) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const token = authHeader.split(' ')[1];
            const payload = jwt.verify(token, env.JWT_SECRET);
            if (roles && !roles.includes(payload.role)) {
                return res.status(403).json({ message: 'Insufficient permissions' });
            }
            req.user = { sub: payload.sub, role: payload.role };
            next();
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};
