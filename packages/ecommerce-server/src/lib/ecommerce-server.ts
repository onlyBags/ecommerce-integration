import express, { Express, Response } from 'express';
import dotenv from 'dotenv';
import { RegisterRoutes } from '../../build/routes';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

RegisterRoutes(app);

const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default server;
