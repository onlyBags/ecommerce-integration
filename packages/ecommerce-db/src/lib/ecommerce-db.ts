import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, UserKey } from '../entity/index.js';
import { envConfig } from '@dg-live/ecommerce-config';

const { dbType, dbHost, dbPort, dbUsername, dbPassword, dbDatabase } =
  envConfig;

export const AppDataSource = new DataSource({
  type: dbType as 'mysql',
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  synchronize: true,
  logging: false,
  entities: [User, UserKey],
  migrations: [],
  subscribers: [],
});
