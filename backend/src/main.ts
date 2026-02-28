import type { IncomingMessage, ServerResponse } from 'http';
import { RequestMethod, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import 'dotenv/config';
import { AppModule } from './app.module';
import { dynamicImport } from './utils/dynamic-import';

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') ?? true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
};

function configureApp(app: INestApplication): void {
  app.enableCors(corsOptions);
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
}

async function registerAdminJSAdapter(): Promise<void> {
  const adminJSModule = await dynamicImport<{
    default: {
      registerAdapter: (adapter: {
        Database: unknown;
        Resource: unknown;
      }) => void;
    };
  }>('adminjs');
  const AdminJS = adminJSModule.default;
  const AdminJSPrisma = await dynamicImport<{
    Database: unknown;
    Resource: unknown;
  }>('@adminjs/prisma');
  AdminJS.registerAdapter({
    Database: AdminJSPrisma.Database,
    Resource: AdminJSPrisma.Resource,
  });
}

let server: express.Express | null = null;

async function getServer(): Promise<express.Express> {
  if (server) return server;
  if (!process.env.VERCEL) await registerAdminJSAdapter();
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn', 'log'] },
  );
  configureApp(app);
  await app.init();
  server = expressApp;
  return server;
}

async function bootstrap(): Promise<void> {
  await registerAdminJSAdapter();
  const app = await NestFactory.create(AppModule);
  configureApp(app);
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
