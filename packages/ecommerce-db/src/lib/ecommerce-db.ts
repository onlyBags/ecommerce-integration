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
  MetaDaum,
  Self,
  Collection,
  Links,
  WoocommerceProduct,
} from '../entity/index.js';
import { envConfig } from '@dg-live/ecommerce-config';

const { dbType, dbHost, dbPort, dbUsername, dbPassword, dbDatabase } =
  envConfig;

export const AppDataSource = new typeorm.DataSource({
  type: dbType as 'mysql',
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Datasource,
    Dimensions,
    Category,
    Tag,
    Image,
    Attribute,
    MetaDaum,
    Self,
    Collection,
    Links,
    WoocommerceProduct,
  ],
  migrations: [],
  subscribers: [],
});
