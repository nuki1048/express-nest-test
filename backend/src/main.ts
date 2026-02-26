import type { IncomingMessage, ServerResponse } from 'http';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import 'dotenv/config';
import { AppModule } from './app.module';

let server: express.Express | null = null;

async function getServer(): Promise<express.Express> {
  if (server) return server;
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn', 'log'] },
  );
  app.setGlobalPrefix('api');
  await app.init();
  server = expressApp;
  return server;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const app = await getServer();
  app(req as express.Request, res as express.Response);
}

if (!process.env.VERCEL) {
  void bootstrap();
}
