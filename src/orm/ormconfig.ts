import { join } from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from '../util/config';
import logger from '../util/logger';
import { User } from './entities/User';

// Allow synchronization of schema and entities in development environment only
// Don't set this option to true in production. You can lose all of your data
let sync = true;
// if ((config.environment == 'dev' || config.environment == 'development') && config.mysql.synchronization) {
//   sync = config.mysql.synchronization;
//   logger.info('Schema sync is on');
// }

logger.info('directory name ', __dirname);

export const AppDataSource = new DataSource({
  type: config.database.type! as 'postgres',
  database: config.database.name,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  synchronize: sync,
  logging: false,
  entities: ['src/orm/entities/**/*{.ts,.js}'],
  //entities: [],
  migrations: [],
  subscribers: [],

  //migrations: [join(__dirname + '/migrations/**/*.{ts,js}')],
  //subscribers: [join(__dirname + '/subscriber/**/*.{ts,js}')],
  namingStrategy: new SnakeNamingStrategy(),
  extra: { connectionLimit: 20 }
});
