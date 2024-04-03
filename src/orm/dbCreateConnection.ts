import { DataSource } from 'typeorm';
import logger from '../util/logger';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const dbCreateConnection = async (
  AppDataSource: DataSource,
  retry = 0
): Promise<DataSource> => {
  try {
    if (AppDataSource.isInitialized) {
      logger.info(
        `Database is already initialized. Database: '${AppDataSource.options.database}'`
      );
      return AppDataSource;
    }
    await AppDataSource.initialize().then((conn) => {
      logger.info(
        `Database connection success. Database: '${conn.options.database}'`
      );
    });
    return AppDataSource;
  } catch (err) {
    if (retry < 3) {
      logger.error(
        'Cannot connect to database. Retrying again in 5 seconds',
        err
      );
      await sleep(5000);
      retry++;
      return await dbCreateConnection(AppDataSource, retry);
    }
    logger.error(`Failed to initialize database`);
    throw err;
  }
};
