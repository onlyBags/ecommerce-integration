import { config } from 'dotenv';
import { ConnectOptions, DatabaseType } from 'typeorm';

config();

export const envConfig = Object.freeze({
  port: parseInt(process.env.PORT || '8080'),
  cypherKey: process.env.CYPHER_KEY,
  cypherIV: process.env.CYPHER_IV,
  cypherAlgorithm: process.env.CYPHER_ALGORITHM,
  dbType: process.env.DB_TYPE as DatabaseType,
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT || '3306'),
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_DATABASE,
});

export default envConfig;
