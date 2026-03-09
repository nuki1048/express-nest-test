import type { IncomingMessage, ServerResponse } from 'http';
import {
  type INestApplication,
  Module,
  RequestMethod,
  type Type,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import 'dotenv/config';
import { ApartmentsModule } from './apartments/apartments.module';
import { BlogPostModule } from './blog-post/blog-post.module';
import { ContactFormModule } from './contact-form/contact-form.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { adminModulePromise } from './admin/admin.module';
import { dynamicImport } from './utils/dynamic-import';

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

const log = (msg: string) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${msg}`);
};

async function registerAdminJSAdapter(): Promise<void> {
  log('registerAdminJSAdapter: start');
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
  log('registerAdminJSAdapter: done');
}

const baseImports = [
  PrismaModule,
  ContactsModule,
  ContactFormModule,
  ApartmentsModule,
  BlogPostModule,
  UploadModule,
];

async function getAppModule(): Promise<Type> {
  log('getAppModule: start');
  await registerAdminJSAdapter();
  log('getAppModule: awaiting adminModulePromise');
  const adminModule = await adminModulePromise;
  log('getAppModule: adminModule ready');
  class AppModule {}
  Module({ imports: [...baseImports, adminModule] })(AppModule);
  return AppModule;
}

let server: express.Express | null = null;

async function getServer(): Promise<express.Express> {
  if (server) return server;
  log('getServer: creating Nest app');
  const AppModule = await getAppModule();
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn', 'log'] },
  );
  configureApp(app);
  log('getServer: calling app.init()');
  await app.init();
  log('getServer: ready');
  server = expressApp;
  return server;
}

async function bootstrap(): Promise<void> {
  const AppModule = await getAppModule();
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
