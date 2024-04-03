import jwt from 'jsonwebtoken';
import { config } from '../util/config';
import logger from '../util/logger';

export function verifyToken(req, res, next) {
    logger.info('req.headers', 'verify token');
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
     const decoded = jwt.verify(token, config.jwt.access_token_secret!);
     logger.info('decoded', decoded.toString());
     req = decoded;
     next();
     } catch (error) {
     res.status(401).json({ error: 'Invalid token' });
     }
};