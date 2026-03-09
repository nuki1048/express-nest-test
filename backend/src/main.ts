import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';
import {
  RequestMethod,
  ValidationPipe,
  type INestApplication,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import 'dotenv/config';
import { AppModule } from './app.module';

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') ?? true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
};

function configureApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  app.enableCors(corsOptions);
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
}

const FAVICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0ea5e9" rx="4"/><path fill="white" d="M16 8l-8 6v10h6v-6h4v6h6V14z"/></svg>';

function serveFavicon(expressApp: express.Express): void {
  expressApp.get('/favicon.ico', (_req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(FAVICON_SVG);
  });
}

function serveAdminPanel(expressApp: express.Express): void {
  const adminPath = path.join(process.cwd(), 'admin', 'dist');
  expressApp.use('/admin', express.static(adminPath, { index: false }));
  expressApp.get(/^\/admin(?:\/.*)?$/, (_req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'));
  });
}

let server: express.Express | null = null;

async function getServer(): Promise<express.Express> {
  if (server) return server;
  const expressApp = express();
  expressApp.get('/', (_req, res) => res.redirect(302, '/admin'));
  serveFavicon(expressApp);
  serveAdminPanel(expressApp);
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
  const expressApp = express();
  expressApp.get('/', (_req, res) => res.redirect(302, '/admin'));
  serveFavicon(expressApp);
  serveAdminPanel(expressApp);
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn', 'log'] },
  );
  configureApp(app);
  await app.init();
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
