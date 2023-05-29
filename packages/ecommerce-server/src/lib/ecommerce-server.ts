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

import { AppDataSource } from '@dg-live/ecommerce-db';
import { envConfig } from '@dg-live/ecommerce-config';
import { RegisterRoutes } from '../routes/routes.js';
import { handleWebhook } from '@dg-live/ecommerce-webhooks';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let swaggerDocument: any;

if (process.env.NODE_ENV !== 'test') {
  console.log('__dirname: ', `${__dirname}/../../public/swagger.json`);
  readFile(`${__dirname}/../../public/swagger.json`, 'utf8').then((data) => {
    swaggerDocument = JSON.parse(data);
    // console.log(data);
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
    await AppDataSource.initialize();
  } catch (error) {
    console.log('Error connecting to database', error);
    process.exit(1);
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
