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
  Slot,
  OrderLog,
} from '../entity/index.js';
import { envConfig } from '@dg-live/ecommerce-config';

const { dbType, dbHost, dbPort, dbUsername, dbPassword, dbDatabase, nodeEnv } =
  envConfig;

console.log(
  '********************nodeEnv !== production: ',
  nodeEnv !== 'production'
);
export const AppDataSource = new typeorm.DataSource({
  type: dbType as 'mysql' | 'mariadb', // 'mysql', // dbType as 'mysql',
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  // synchronize: nodeEnv !== 'production',
  synchronize: true,
  // poolSize: 10,
  logging: nodeEnv !== 'production',
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
    Slot,
    OrderLog,
  ],
  migrations: [],
  subscribers: [],
});
