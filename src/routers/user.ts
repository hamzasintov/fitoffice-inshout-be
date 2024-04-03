import express, { Request, Response, NextFunction } from 'express';
import logger from '../util/logger';
import { getSchema, postSchema, patchSchema } from '../models/user';
import validate from '../middleware/request_validator';
import {
  login,
  register,
  profile,
  forgotPassword,
  resetPassword
} from '../controllers/User';
import { verifyToken } from '../middleware/jwt';

export function getUsersRouter(): express.Router {
  const router = express.Router();

  let users: any[] = [];
  let idCounter: number = 1;

  // GET specific user by ID
  // router.get('/:id', (req: Request, res: Response) => {
  //   logger.info('req.params.id', req.params.id);
  //   const user = users.find((u) => u.id === parseInt(req.params.id));
  //   if (!user) {
  //     res.status(404).send('User not found');
  //     return;
  //   }
  //   res.json(user);
  // });

  // POST (create) a new user
  // router.post(
  //   '/',
  //   validate(postSchema, 'body'),
  //   (req: Request, res: Response) => {
  //     let user = users.find((u) => u.email === req.body.email);
  //     if (user) return res.status(409).send('User already exists');
  //     user = {
  //       id: idCounter++,
  //       name: req.body.name,
  //       email: req.body.email
  //     };
  //     users.push(user);
  //     return res.status(201).json(user);
  //   }
  // );

  // PUT (update) a user by ID
  // router.patch('/:id', (req: Request, res: Response) => {
  //   const user = users.find((u) => u.id === parseInt(req.params.id));
  //   if (!user) {
  //     res.status(404).send('User not found');
  //     return;
  //   }

  //   user.name = req.body.name || user.name;
  //   user.email = req.body.email || user.email;
  //   user.age = req.body.age || user.age;
  //   user.password = req.body.password || user.password;

  //   res.json(user);
  // });

  // DELETE a user by ID
  // router.delete('/:id', (req: Request, res: Response) => {
  //   const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  //   if (userIndex === -1) {
  //     res.status(404).send('User not found');
  //     return;
  //   }
  //   const deletedUser = users.splice(userIndex, 1);
  //   res.json(deletedUser[0]);
  // });

  router.post('/login', login);
  router.post('/register', register);
  router.get('/profile', verifyToken, profile);
  router.post('/forgotPassword', forgotPassword);
  router.post('/resetPassword', resetPassword);
  return router;
}
