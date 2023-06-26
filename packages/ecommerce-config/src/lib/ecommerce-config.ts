import { config } from 'dotenv';
import { DatabaseType } from 'typeorm';

if (process.env.NODE_ENV === 'development') {
  console.log(
    '*********************************using dev env + process.env.MYSQL_ROOT_PASSWORD' +
      process.env.MYSQL_ROOT_PASSWORD
  );
  config({ path: process.cwd() + '/../../.env.dev' });
} else {
  console.log('*********************************using prod env');
  config({ path: process.cwd() + '/../../.env.prod' });
}
console.log(
  '*********************************process.env.DB_TYPE' +
    process.env.MYSQL_ROOT_PASSWORD
);
export const envConfig = Object.freeze({
  port: parseInt(process.env.PORT || '8080'),
  cypherKey: process.env.CYPHER_KEY || '',
  cypherIV: process.env.CYPHER_IV || '',
  cypherAlgorithm: process.env.CYPHER_ALGORITHM || '',
  dbType: process.env.DB_TYPE as DatabaseType,
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '3306'),
  dbUsername: process.env.DB_USERNAME || 'root',
  dbPassword: process.env.MYSQL_ROOT_PASSWORD || '',
  dbDatabase: process.env.DB_DATABASE || 'ecommerce',
  magentoTestConsumerKey: process.env.MAGENTO_TEST_CONSUMER_KEY || '',
  magentoTestConsumerSecret: process.env.MAGENTO_TEST_CONSUMER_SECRET || '',
  magentoTestBaseUrl: process.env.MAGENTO_TEST_BASE_URL || '',
  masterKey: process.env.MASTER_KEY || 'no-key',
  webhookSecret: process.env.WEBHOOK_SECRET || '',
  woocommerceTestConsumerKey: process.env.WOOCOMMERCE_TEST_CONSUMER_KEY || '',
  woocommerceTestConsumerSecret: process.env.WOOCOMMERCE_TEST_CONSUMER_SECRET,
  woocommerceTestBaseUrl: process.env.WOOCOMMERCE_TEST_BASE_URL || '',
});
export default envConfig;
