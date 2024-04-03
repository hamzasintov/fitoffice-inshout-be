import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomJwtPayload } from 'util/jwt';
import { config } from '../util/config';
import logger from '../util/logger';
import { AppDataSource } from '../orm/ormconfig';
import { User } from '../orm/entities/User';

export async function verifyToken(req, res, next) {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      const token = authorization.split(' ')[1];
      const decodedToken = jwt.verify(
        token,
        config.jwt.access_token_secret!
      ) as CustomJwtPayload;
      const { id } = decodedToken;
      // Get User from Token
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Attach the user to the request object
      req.user = user;
      //req.body.userId = user.id;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } else return res.status(401).json({ error: 'Access denied' });
}
