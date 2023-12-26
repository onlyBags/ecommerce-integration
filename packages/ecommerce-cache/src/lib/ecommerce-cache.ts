import { createClient } from 'redis';
import { Schema, Repository } from 'redis-om';

import { envConfig } from '@dg-live/ecommerce-config';

const { redisHost, redisPassword, redisPort } = envConfig;

// const redisUrl = `redis://default:${redisPassword}@${redisHost}:${redisPort}`;
const redisUrl = `redis://default:${redisPassword}@${redisHost}:${redisPort}`;

const datasourceSchema = new Schema(
  'datasource',
  {
    apiKey: { type: 'string' },
    datasourceId: { type: 'number' },
    consumerKey: { type: 'string' },
    consumerSecret: { type: 'string' },
    baseUrl: { type: 'string' },
  },
  {
    dataStructure: 'JSON',
  }
);

const analyticsSchema = new Schema(
  'analytics',
  {
    datasourceId: { type: 'number' },
    totalSales: { type: 'string' },
    totalUnitSales: { type: 'string' },
    totalSalesDetails: { type: 'string' }, // Storing as JSON string
  },
  {
    dataStructure: 'JSON',
  }
);

export const redisClient = createClient({
  // password: redisPassword,
  url: redisUrl,
});

export const datasourceCacheRepository = new Repository(
  datasourceSchema,
  redisClient
);

export const analyticsCacheRepository = new Repository(
  analyticsSchema,
  redisClient
);

analyticsCacheRepository;
redisClient.on('connect', async () => {
  console.log('Redis client connected');
  try {
    await datasourceCacheRepository.createIndex();
    await analyticsCacheRepository.createIndex();
    console.log('Redis Index created');
  } catch (error) {
    console.log('Error creating index: ', error);
    debugger;
  }
});

redisClient.on('error', (err) => {
  console.log('Error ' + err);
  console.log('redisUrl ', redisUrl);
  if (err.message)
    console.log('Error message: ', JSON.stringify(err.message, null, 2));
});
