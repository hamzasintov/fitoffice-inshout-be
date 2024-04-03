import { NextFunction, Request, Response } from 'express';
import {
  insertPackage,
  softDeletePackage,
  getAllPackages,
  updatePackages
} from '../services/Package';
import { Package } from '../orm/entities/Package';
import { VdsError } from '../util/vds-error/vdsError';

export const addPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newPackage }: { newPackage: Package } = req.body;
    const payload = await insertPackage(newPackage);
    return res.status(200).json(payload);
  } catch (error) {
    if (error instanceof VdsError) {
      return res.status(error.HttpStatusCode).json(error.ErrorResponse);
    } else {
      return res.status(500).send('Internal Server Error');
    }
  }
};

export const deletePackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id }: { id: number } = req.body;
    const payload = await softDeletePackage(id);
    return res.status(200).json(payload);
  } catch (error) {
    if (error instanceof VdsError) {
      return res.status(error.HttpStatusCode).json(error.ErrorResponse);
    } else {
      return res.status(500).send('Internal Server Error');
    }
  }
};

export const getPackages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const payload = await getAllPackages(page, limit, skip);
    return res.status(200).json(payload);
  } catch (error) {
    if (error instanceof VdsError) {
      return res.status(error.HttpStatusCode).json(error.ErrorResponse);
    } else {
      return res.status(500).send('Internal Server Error');
    }
  }
};

export const updatePackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { packages }: { packages: Package[] } = req.body;
    const payload = await updatePackages(packages);
    return res.status(200).json(payload);
  } catch (error) {
    if (error instanceof VdsError) {
      return res.status(error.HttpStatusCode).json(error.ErrorResponse);
    } else {
      return res.status(500).send('Internal Server Error');
    }
  }
};
