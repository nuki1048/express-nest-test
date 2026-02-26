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

  // Vercel catch-all adds ?[...path]=contacts; strip it so Nest sees clean /api/contacts
  const raw = req.url ?? '/';
  const [pathname, queryString] = raw.split('?');
  const pathOnly = pathname.startsWith('/api')
    ? pathname
    : '/api' + (pathname.startsWith('/') ? pathname : '/' + pathname);

  const searchParams = queryString ? new URLSearchParams(queryString) : null;
  if (searchParams) {
    searchParams.delete('[...path]');
    searchParams.delete('path');
    const remaining = searchParams.toString();
    req.url = remaining ? `${pathOnly}?${remaining}` : pathOnly;
  } else {
    req.url = pathOnly;
  }

  server(req, res);
}
