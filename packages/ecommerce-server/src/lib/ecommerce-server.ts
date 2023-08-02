import express, {
  Express,
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFile } from 'fs/promises';
import { ValidateError } from 'tsoa';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
import helmet from 'helmet';
import url from 'url';
import http from 'http';
import https from 'https';

import { AppDataSource } from '@dg-live/ecommerce-db';
import { redisClient } from '@dg-live/ecommerce-cache';
import { envConfig } from '@dg-live/ecommerce-config';
import { RegisterRoutes } from '../routes/routes.js';
import { handleWebhook } from '@dg-live/ecommerce-webhooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let swaggerDocument: any;

if (process.env.NODE_ENV !== 'test') {
  readFile(`${__dirname}/../../public/swagger.json`, 'utf8').then((data) => {
    swaggerDocument = JSON.parse(data);
    console.log('12');
  });
}

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

const server = app.listen(port, async () => {
  try {
    await redisClient.connect();
    await AppDataSource.initialize();
    console.log('Connected to database');
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
