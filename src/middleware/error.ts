import logger from '../util/logger';
import { Request, Response, NextFunction } from 'express';

const errorHandlerMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(error);
  res
    .status(500)
    .send('Unable to complete Operation , Contact Admin for more details');
  next();
};

export default errorHandlerMiddleware;
