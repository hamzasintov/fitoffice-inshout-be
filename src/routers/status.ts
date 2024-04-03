import * as express from 'express';

export function getStatusRouter(): express.Router {
  const router = express.Router();

  router.get('/', (_, res, next) => {
    (async () => {
      res.status(200).json({ status: 'ready' });
    })();
  });
  return router;
}
