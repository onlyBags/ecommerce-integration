import { config } from 'dotenv';
import { DatabaseType } from 'typeorm';

if (process.env.NODE_ENV === 'local') {
  // console.log('**using local env MYSQL_PASSWORD: ' + process.env.MYSQL_PASSWORD);
  config({ path: '.env.local' });
} else if (process.env.NODE_ENV === 'development') {
  // console.log('**using dev env MYSQL_PASSWORD: ' + process.env.MYSQL_PASSWORD);
  config({ path: '.env.dev' });
} else {
  // console.log('**using prod env');
  // console.log('path:' + '.env.prod');
  config({ path: '.env.prod' });
}
// console.log('**process.env.MYSQL_DB_TYPE ' + process.env.MYSQL_DB_TYPE);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
export const envConfig = Object.freeze({
  port: parseInt(process.env.PORT),
  cypherKey: process.env.CYPHER_KEY,
  cypherIV: process.env.CYPHER_IV,
  cypherAlgorithm: process.env.CYPHER_ALGORITHM,
  dbType: process.env.MYSQL_TYPE as DatabaseType,
  dbHost: process.env.MYSQL_HOST,
  dbPort: parseInt(process.env.MYSQL_PORT),
  dbUsername: process.env.MYSQL_USERNAME,
  dbPassword: process.env.MYSQL_PASSWORD,
  dbDatabase: process.env.MYSQL_DATABASE,
  magentoTestConsumerKey: process.env.MAGENTO_TEST_CONSUMER_KEY || '',
  magentoTestConsumerSecret: process.env.MAGENTO_TEST_CONSUMER_SECRET || '',
  magentoTestBaseUrl: process.env.MAGENTO_TEST_BASE_URL || '',
  masterKey: process.env.MASTER_KEY || 'no-key',
  webhookSecret: process.env.WEBHOOK_SECRET || '',
  woocommerceTestConsumerKey: process.env.WOOCOMMERCE_TEST_CONSUMER_KEY || '',
  woocommerceTestConsumerSecret: process.env.WOOCOMMERCE_TEST_CONSUMER_SECRET,
  woocommerceTestBaseUrl: process.env.WOOCOMMERCE_TEST_BASE_URL || '',
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT),
  redisPassword: process.env.REDIS_PASSWORD,
  nodeEnv: process.env.NODE_ENV || 'local',
  wsPort: parseInt(process.env.WS_PORT),
  subGraphEndpoint: process.env.SUBGRAPH_ENDPOINT,
  subGraphVersion: process.env.SUBGRAPH_VERSION,
  infuraKey: process.env.INFURA_KEY,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3BucketName: process.env.S3_BUCKET_NAME,
  mailgunApiKeyId: process.env.MAILGUN_API_KEY_ID || '',
  mailgunApiKey: process.env.MAILGUN_API_KEY || '',
  binanceApiKey: process.env.BINANCE_API_KEY || '',
  binanceApiSecret: process.env.BINANCE_API_SECRET || '',
  binanceApiUrl: process.env.BINANCE_API_URL || '',
  coinbaseApiKey: process.env.COINBASE_API_KEY || '',
  coinbaseWhSecret: process.env.COINBASE_WH_SECRET || '',
  coinbaseApiVersion: process.env.COINBASE_API_VERSION || '',
  coinbaseApiUrl: process.env.COINBASE_API_URL || '',
  ecommerceBaseUrl: process.env.ECOMMERCE_BASE_URL || '',
});

export default envConfig;
