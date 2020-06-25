import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { INestApplication } from '@nestjs/common';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';

const server = express();

server.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

// Creating nest server with app module and express instance
export const createNestServer = async (
  expressServerInstance: express.Express
): Promise<INestApplication> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressServerInstance)
  );
  return app.init();
};

// Create new server and handle returned promise
createNestServer(server)
  .then(p => console.log('Nest is running'))
  .catch(err => console.error('Nest could not be run', err));

// Export cloud firebase api
export const cloudApi = functions.https.onRequest(server);
