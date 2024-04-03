// src/index.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getStatusRouter } from './routers/status';
import traceMiddleware from './middleware/trace';
import errorHandlerMiddleware from './middleware/error';
import logRequest from './middleware/request_logger';
import { getUsersRouter } from './routers/user';
import { getDataSource } from './db';
import logger from './util/logger';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.json';
import { getPackagesRouter } from './routers/package';
import cors from 'cors'; // Import the cors middleware
/*
 * Load up and parse configuration details from
 * the `.env` file to the `process.env`
 * object of Node.js
 */
dotenv.config();

/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(traceMiddleware);
app.use(errorHandlerMiddleware);
app.use(logRequest);
app.use(express.json());
app.use('/status', getStatusRouter());
app.use('/users', getUsersRouter());
app.use('/packages', getPackagesRouter());
/* Define a route for the root path ("/")
 using the HTTP GET method */
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, async () => {
  const db = await getDataSource();
  // const repo = db.getRepository(User);
  // const user: User = new User()
  // user.userName = "Noum";
  // repo.save(user);

  logger.info('database ', db);
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
