import fs from 'fs';
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
import { FAVICON_SVG } from './constants/favicon';

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

function getAdminPath(): string {
  const candidates = [
    path.join(process.cwd(), 'dist', 'admin'),
    path.join(process.cwd(), 'admin'),
    path.join(process.cwd(), 'admin', 'dist'),
    path.join(__dirname, 'admin'),
  ];
  const found = candidates.find((p) =>
    fs.existsSync(path.join(p, 'index.html')),
  );
  if (!found) {
    throw new Error(`Admin build not found. Tried: ${candidates.join(', ')}`);
  }
  return found;
}

function setupStaticRoutes(expressApp: express.Express): void {
  expressApp.get('/favicon.ico', (_req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(FAVICON_SVG);
  });
  try {
    const adminPath = getAdminPath();
    expressApp.use('/admin', express.static(adminPath, { index: false }));
    expressApp.get(/^\/admin(?:\/.*)?$/, (_req, res) =>
      res.sendFile(path.join(adminPath, 'index.html')),
    );
  } catch {
    // On Vercel, admin is served by static files; API function only handles /api/*
  }
}

let server: express.Express | null = null;

async function getServer(): Promise<express.Express> {
  if (server) return server;
  const expressApp = express();
  if (!process.env.VERCEL) {
    expressApp.get('/', (_req, res) => res.redirect(302, '/admin'));
  }
  setupStaticRoutes(expressApp);
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

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const app = await getServer();
  app(req as express.Request, res as express.Response);
}

if (!process.env.VERCEL) {
  void getServer().then((app) => app.listen(process.env.PORT ?? 3000));
}
