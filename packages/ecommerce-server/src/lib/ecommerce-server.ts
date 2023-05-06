import express, { Application, Request, Response } from 'express';
import config from '../config';

const app: Application = express();

app.use('/', (req: Request, res: Response): void => {
  res.json({
    data: 'It Works!',
  });
});

const server = app.listen(config.port, (): void => {
  console.log('SERVER IS UP ON PORT:', config.port);
});

export default server;
