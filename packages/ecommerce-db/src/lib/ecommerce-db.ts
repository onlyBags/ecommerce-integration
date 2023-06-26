import 'reflect-metadata';
import * as typeorm from 'typeorm';

import {
  User,
  Datasource,
  Dimensions,
  Category,
  Tag,
  Image,
  Attribute,
  MetaData,
  Self,
  Collection,
  Links,
  WoocommerceProduct,
} from '../entity/index.js';
import { envConfig } from '@dg-live/ecommerce-config';

const { dbType, dbHost, dbPort, dbUsername, dbPassword, dbDatabase } =
  envConfig;

export const AppDataSource = new typeorm.DataSource({
  type: 'mysql', // dbType as 'mysql',
  host: dbHost,
  port: dbPort,
  username: 'dglive-local', // dbUsername,
  password: 'eawT5caT+u@Jmyf!', // dbPassword,
  database: 'ecommerce', // dbDatabase,
  synchronize: true,
  // poolSize: 10,
  logging: true,
  // debug: true,
  // trace: true,
  insecureAuth: true,
  entities: [
    User,
    Datasource,
    Dimensions,
    Category,
    Tag,
    Image,
    Attribute,
    MetaData,
    Self,
    Collection,
    Links,
    WoocommerceProduct,
  ],
  migrations: [],
  subscribers: [],
});
