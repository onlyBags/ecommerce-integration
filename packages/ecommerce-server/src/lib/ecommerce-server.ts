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

import '@dg-live/ecommerce-websocket';
import { AppDataSource } from '@dg-live/ecommerce-db';
import { redisClient } from '@dg-live/ecommerce-cache';
import { envConfig } from '@dg-live/ecommerce-config';
import { RegisterRoutes } from '../routes/routes.js';
import { handleWebhook } from '@dg-live/ecommerce-webhooks';
import { startGraphPolling } from '@dg-live/ecommerce-web3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let swaggerDocument: any;

if (process.env.NODE_ENV !== 'test') {
  readFile(`${__dirname}/../../public/swagger.json`, 'utf8').then((data) => {
    swaggerDocument = JSON.parse(data);
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

app.get('/joystick', (req, res) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self' *; font-src 'self'; img-src 'self' data:; script-src 'self' blob: https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js 'unsafe-inline'; style-src 'self' https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css 'unsafe-inline'; frame-src 'self';"
  );
  return res.sendFile(
    path.resolve('./packages/ecommerce-server/public/joystick.html')
  );
});

const server = app.listen(port, async () => {
  try {
    await redisClient.connect();
    await AppDataSource.initialize();
    startGraphPolling();
    // processImage();
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

const processImage = async () => {
  // Process your data here as needed

  // Define the path to the image you want to process
  const imagePath = path.join(__dirname, 'pizza.jpg'); // Adjust the path as needed

  // Create a FormData instance to handle file upload
  const formData = new FormData();
  formData.append('file', fs.createReadStream(imagePath));

  try {
    // Send the request to your Python service
    const imageUrl =
      'https://demostore.unversed.org/wp-content/uploads/2023/07/iphone14.png';
    const response = await axios.post('http://localhost:5000/process-image', {
      url: imageUrl,
    });
    debugger;
    // Additional processing or return statement as needed
  } catch (error) {
    console.error('Error processing image:', error);
    // Handle error
  }
};

export default server;
