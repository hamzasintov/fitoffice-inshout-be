import express from 'express';
import {
  addPackage,
  deletePackage,
  updatePackage,
  getPackages
} from '../controllers/Package';
import { verifyToken } from '../middleware/jwt';

export function getPackagesRouter(): express.Router {
  const router = express.Router();
  router.post('/add', verifyToken, addPackage);
  router.delete('/delete', verifyToken, deletePackage);
  router.get('/all', verifyToken, getPackages);
  router.patch('/update', verifyToken, updatePackage);
  return router;
}
