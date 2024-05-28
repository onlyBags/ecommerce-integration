import express, {
  Express,
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readFile } from 'fs/promises';
import { ValidateError } from 'tsoa';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
import helmet from 'helmet';
import url from 'url';
import http from 'http';
import https from 'https';
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';
import AWS from 'aws-sdk';

import '@dg-live/ecommerce-websocket';
import { AppDataSource } from '@dg-live/ecommerce-db';
import { redisClient } from '@dg-live/ecommerce-cache';
import { envConfig } from '@dg-live/ecommerce-config';
import { RegisterRoutes } from '../routes/routes.js';
import { handleWebhook } from '@dg-live/ecommerce-webhooks';
import { startGraphPolling } from '@dg-live/ecommerce-web3';
import {
  getAllPayments,
  magentoGetOrder,
  magentoOrderRest,
} from '@dg-live/ecommerce-magento';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let swaggerDocument: any;

if (process.env.NODE_ENV !== 'test') {
  readFile(`${__dirname}/../../public/swagger.json`, 'utf8').then((data) => {
    swaggerDocument = JSON.parse(data);
  });
}

// Configure AWS
AWS.config.update({
  accessKeyId: envConfig.awsAccessKeyId,
  secretAccessKey: envConfig.awsSecretAccessKey,
  region: 'us-east-1', // Replace with your bucket's region
});

const s3 = new AWS.S3();

const app: Express = express();
const port = envConfig.port || 8080;

app.use(
  '/v1/webhooks/:apiKey/:datasourceId',
  express.raw({ type: '*/*' }),
  handleWebhook
);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

app.get('/v1/image', async (req: ExRequest, res: ExResponse): Promise<any> => {
  const parts = url.parse(req.url, true);
  const imageUrl =
    typeof parts.query.src === 'string' ? parts.query.src : parts.query.src[0];

  const parsedUrl = new URL(imageUrl);

  const protocol = parsedUrl.protocol;
  const hostname = parsedUrl.hostname;
  const pathname = parsedUrl.pathname;

  const fullUrlString = parsedUrl.toString();

  const filename = fullUrlString.split('/').pop();

  const options = {
    port: protocol === 'https:' ? 443 : 80,
    host: hostname,
    method: 'GET',
    path: pathname,
    accept: '*/*',
  };

  const request =
    options.port === 443 ? https.request(options) : http.request(options);

  request.addListener('response', function (proxyResponse) {
    let offset = 0;
    const contentLength = parseInt(proxyResponse.headers['content-length'], 10);
    const body = Buffer.alloc(contentLength);

    proxyResponse.setEncoding('binary');
    proxyResponse.addListener('data', function (chunk) {
      body.write(chunk, offset, 'binary');
      offset += chunk.length;
    });

    proxyResponse.addListener('end', function () {
      res.contentType(filename);
      res.write(body);
      res.end();
    });
  });

  request.end();
});

app.get('/mg-payment-methods', async (req: ExRequest, res: ExResponse) => {
  try {
    const result = await getAllPayments({ apiKey: '1', datasourceId: 1 });
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
});

app.get('/mg-get-order', async (req: ExRequest, res: ExResponse) => {
  try {
    const orderId =
      typeof req.query.orderId === 'object'
        ? req.query.orderId[0]
        : req.query.orderId;
    if (!orderId) throw new Error('Please provide an order id');

    const result = await magentoGetOrder({
      apiKey: '1',
      datasourceId: 1,
      orderId,
    });
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
});

app.get(
  '/v1/sdk-image-proxy',
  async (req: ExRequest, res: ExResponse): Promise<any> => {
    try {
      const imageUrl = req.query.src as string;
      if (!imageUrl) {
        return res.status(400).send('Missing image src query parameter');
      }
      const response = await axios.get(imageUrl, { responseType: 'stream' });

      res.setHeader('Content-Type', response.headers['content-type']);
      res.setHeader('Content-Length', response.headers['content-length']);

      response.data.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);

app.get(
  '/v1/sdk-image-res',
  async (req: ExRequest, res: ExResponse): Promise<any> => {
    try {
      const imageUrl = req.query.src as string;
      if (!imageUrl) {
        return res.status(400).send('Missing image src query parameter');
      }

      const parsedUrl = new URL(imageUrl);
      const bucket = parsedUrl.hostname.split('.')[0];
      const key = parsedUrl.pathname.substring(1);

      const s3Params = {
        Bucket: bucket,
        Key: key,
      };

      const readStream = s3.getObject(s3Params).createReadStream();

      readStream.on('error', (err: Error) => {
        console.error(err);
        return res.status(500).send('Error reading file from S3');
      });

      // Optionally set the content type here if you want
      // For example: res.type('image/png');

      readStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);

RegisterRoutes(app);

app.use(
  (
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
  ): ExResponse | void => {
    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
      return res.status(422).json({
        message: err?.message ?? 'Validation Failed',
        details: err?.fields,
      });
    }
    if (err instanceof Error) {
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }

    next();
  }
);

app.use('/public', express.static('public/images'));

app.use('/docs', swaggerUI.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(swaggerUI.generateHTML(swaggerDocument));
});

app.get('/joystick', (req, res) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self' *; font-src 'self'; img-src 'self' data:; script-src 'self' blob: https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js 'unsafe-inline'; style-src 'self' https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css 'unsafe-inline'; frame-src 'self';"
  );
  let filePath;

  if (process.env.NODE_ENV === 'production') {
    // Path for production
    filePath = path.resolve(__dirname, '../../public/joystick.html');
  } else {
    // Path for development
    filePath = path.resolve('./packages/ecommerce-server/public/joystick.html');
  }

  return res.sendFile(filePath);
});

const server = app.listen(port, async () => {
  try {
    await redisClient.connect();
    console.log('Connected to redis');
    await AppDataSource.initialize();
    console.log('Connected to database');
    startGraphPolling();
    console.log('Started graph polling');
  } catch (error) {
    console.log('Error connecting to database');
    console.log(error);
    // process.exit(1);
  }
  console.log(
    `⚡️[server]: Server is running at http://localhost:${port}/docs`
  );
});

app.use((_, res: ExResponse) => {
  res.status(404).send({
    message: 'Not Found',
  });
});

export default server;
