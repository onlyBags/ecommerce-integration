import 'reflect-metadata';
import * as typeorm from 'typeorm';

import {
  User,
  Customer,
  Datasource,
  Dimensions,
  Category,
  Tag,
  Image,
  Attribute,
  AttributeOption,
  MetaData,
  Self,
  Collection,
  Links,
  WoocommerceProduct,
  Billing,
  Shipping,
  Order,
} from '../entity/index.js';
import { envConfig } from '@dg-live/ecommerce-config';

const { dbType, dbHost, dbPort, dbUsername, dbPassword, dbDatabase } =
  envConfig;

export const AppDataSource = new typeorm.DataSource({
  type: 'mysql', // dbType as 'mysql',
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  synchronize: true,
  // poolSize: 10,
  logging: true,
  // debug: true,
  // trace: true,
  insecureAuth: true,
  entities: [
    User,
    Customer,
    Datasource,
    Dimensions,
    Category,
    Tag,
    Image,
    Attribute,
    AttributeOption,
    MetaData,
    Self,
    Collection,
    Links,
    WoocommerceProduct,
    Billing,
    Shipping,
    Order,
  ],
  migrations: [],
  subscribers: [],
});
