import { config } from 'dotenv';
import { DatabaseType } from 'typeorm';

config({ path: process.cwd() + '/../../.env' });

export const envConfig = Object.freeze({
  port: parseInt(process.env.PORT || '8080'),
  cypherKey: process.env.CYPHER_KEY || '',
  cypherIV: process.env.CYPHER_IV || '',
  cypherAlgorithm: process.env.CYPHER_ALGORITHM || '',
  dbType: process.env.DB_TYPE as DatabaseType,
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '3306'),
  dbUsername: process.env.DB_USERNAME || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbDatabase: process.env.DB_DATABASE || 'ecommerce',
  magentoTestConsumerKey: process.env.MAGENTO_TEST_CONSUMER_KEY || '',
  magentoTestConsumerSecret: process.env.MAGENTO_TEST_CONSUMER_SECRET || '',
  masterKey: process.env.MASTER_KEY || 'no-key',
});

export default envConfig;
