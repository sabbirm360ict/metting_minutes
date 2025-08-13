import knex, { Knex } from 'knex';
import config from '../utils/config/config';

let dbInstance: Knex;

const createDbCon = () => {
  if (!dbInstance) {
    dbInstance = knex({
      client: 'pg',
      connection: {
        host: config.DB_HOST,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PASS,
        database: config.DB_NAME,
        // ssl: {
        //   rejectUnauthorized: false,
        // },
      },
      pool: {
        min: 5,
        max: 100,
      },
      acquireConnectionTimeout: 10000,
    });

    console.log('✅ Database connected successfully! 💻');
  }
  return dbInstance;
};

export const db = createDbCon();
