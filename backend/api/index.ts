import type { Request, Response } from 'express';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from '../src/app.module';

let server: express.Express | null = null;

async function bootstrap(): Promise<express.Express> {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      logger: ['error', 'warn', 'log'],
    },
  );

  await app.init();

  return expressApp;
}

export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  if (!server) {
    server = await bootstrap();
  }

  server(req, res);
}
