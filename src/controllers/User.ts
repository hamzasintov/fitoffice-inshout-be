import { NextFunction, Request, Response } from 'express';
import {
  loginUser,
  userProfile,
  registerUser,
  forgotPass,
  resetPass
} from '../services/User';
import { VdsError } from '../util/vds-error/vdsError';

/**
 * @description register the user i.e., validates email and returns the payload along with jwt token
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const role = req.body.role ?? 1;
    const name = req.body.name ?? '';
    const payload = await registerUser(email, password, name, role);
    res.status(200).json(payload);
  } catch (error) {
    if (error instanceof VdsError) {
      res.status(error.HttpStatusCode).json(error.ErrorResponse);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};

/**
 * @description logs in the user i.e., validates the username and password and returns the payload along with jwt token
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const payload = await loginUser(email, password);
    res.status(200).json(payload);
  } catch (error) {
    if (error instanceof VdsError) {
      res.status(error.HttpStatusCode).json(error.ErrorResponse);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};

/**
 * @description get the profile of currently logged in user using jwt token
 */
export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = await userProfile(req);
    res.status(200).json(payload);
  } catch (error) {
    if (error instanceof VdsError) {
      res.status(error.HttpStatusCode).json(error.ErrorResponse);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};

/**
 * @description sends the reset password link to the user's registered email
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const payload = await forgotPass(email);
    res.status(200).json(payload);
  } catch (error) {
    if (error instanceof VdsError) {
      res.status(error.HttpStatusCode).json(error.ErrorResponse);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};

/**
 * @description set the new password by using the valid reset token from reset password email
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newPassword, resetToken } = req.body;
    const payload = await resetPass(newPassword, resetToken);
    res.status(200).json(payload);
  } catch (error) {
    if (error instanceof VdsError) {
      res.status(error.HttpStatusCode).json(error.ErrorResponse);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};
