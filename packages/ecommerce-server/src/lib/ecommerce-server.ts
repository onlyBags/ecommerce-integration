import express, {
  Express,
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from 'express';
import { ValidateError } from 'tsoa';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
import helmet from 'helmet';

import { AppDataSource } from '@dg-live/ecommerce-db';
import { envConfig } from '@dg-live/ecommerce-config';
import { RegisterRoutes } from '../routes/routes.js';

/* istanbul ignore next */
import swaggerDocument from '../../public/swagger.json' assert { type: 'json' };

const app: Express = express();
const port = envConfig.port || 8080;

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
        message: 'Validation Failed',
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
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.use((_, res: ExResponse) => {
  res.status(404).send({
    message: 'Not Found',
  });
});

export default server;
