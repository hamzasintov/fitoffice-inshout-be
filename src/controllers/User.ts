import { NextFunction, Request, Response } from 'express';
import {loginUser, registerUser} from '../services/User'
import logger from '../util/logger';

/**
 * @description register the using eamil, password, username and role and returns the payload along with jwt token
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const role = req.body.role ?? 1;
    const name = req.body.name ?? '';
    const payload = await registerUser(email, password, name, role);
    res.status(200).json(payload); 
  } catch (error) {
    //   return handleCustomError(
    //     next,
    //     httpStatus.BAD_REQUEST,
    //     errorMessage('login', API_ERRORS.INCORRECT_CREDENTIALS),
    //     new Error(errorMessage('login', API_ERRORS.INCORRECT_CREDENTIALS)),
    //   );
  }
};

/**
 * @description logs in the user i.e., validates the username and password and returns the payload along with jwt token
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const payload = await loginUser(email, password);
      res.status(200).json(payload);
    } catch (error) {
    //   return handleCustomError(
    //     next,
    //     httpStatus.BAD_REQUEST,
    //     errorMessage('login', API_ERRORS.INCORRECT_CREDENTIALS),
    //     new Error(errorMessage('login', API_ERRORS.INCORRECT_CREDENTIALS)),
    //   );
    }
  };

  export const profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      logger.info(body.json());
      //return res.customSuccess(httpStatus.OK, 'login success', payload);
    } catch (error) {
    //   return handleCustomError(
    //     next,
    //     httpStatus.BAD_REQUEST,
    //     errorMessage('login', API_ERRORS.INCORRECT_CREDENTIALS),
    //     new Error(errorMessage('login', API_ERRORS.INCORRECT_CREDENTIALS)),
    //   );
    }
  };

  


