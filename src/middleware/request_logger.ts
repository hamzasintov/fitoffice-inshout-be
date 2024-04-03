import logger from '../util/logger';
import { Request, Response, NextFunction } from 'express';

const logRequest = (req: Request, res: Response, next: NextFunction): void => {
  logger.info(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);
  next();
};

export default logRequest;
