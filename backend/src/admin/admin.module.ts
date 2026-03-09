import { DynamicModule } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { dynamicImport } from '../utils/dynamic-import';
import { adminConfig } from './config';
import { getAuthConfig } from './auth';
import { buildAdminResources, modelWithIdForAdminJS } from './resources';
import type { PrismaDmmfModel } from './resources';
import path from 'path';

export interface AdminModuleFactoryOptions {
  adminJsOptions: {
    rootPath: string;
    componentLoader: { add: (name: string, filePath: string) => string };
    resources: Array<{
      resource: { model: PrismaDmmfModel; client: PrismaService };
      options: Record<string, unknown>;
    }>;
    branding?: { companyName?: string; withMadeWithLove?: boolean };
    locale?: { language: string; translations?: Record<string, unknown> };
  };
  auth?: {
    authenticate: (email: string, password: string) => Promise<unknown>;
    cookieName: string;
    cookiePassword: string;
  };
  sessionOptions?: {
    resave: boolean;
    saveUninitialized: boolean;
    secret: string;
  };
}

const log = (msg: string) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] admin.module: ${msg}`);
};

export const adminModulePromise: Promise<DynamicModule> = dynamicImport<{
  AdminModule: { createAdminAsync: (config: unknown) => DynamicModule };
}>('@adminjs/nestjs')
  .then((mod) => {
    log('@adminjs/nestjs loaded');
    return mod;
  })
  .then(async ({ AdminModule }) => {
    log('loading @adminjs/prisma');
    const AdminJSPrisma = await dynamicImport<{
      getModelByName: (name: string) => PrismaDmmfModel;
    }>('@adminjs/prisma');
    log('@adminjs/prisma loaded');
    log('loading adminjs');
    const adminjs = await dynamicImport<{
      ComponentLoader: new () => {
        add: (name: string, filePath: string) => string;
      };
    }>('adminjs');
    log('adminjs loaded');
    const componentLoader = new adminjs.ComponentLoader();
    // Use __dirname so paths work in both dev (ts-node) and prod (dist/)
    const adminDir = __dirname;

    componentLoader.add(
      'LinksField',
      path.join(adminDir, 'components', 'LinksField.tsx'),
    );
    componentLoader.add(
      'AddressField',
      path.join(adminDir, 'components', 'AddressField.tsx'),
    );
    componentLoader.add(
      'ImageUploadField',
      path.join(adminDir, 'components', 'ImageUpload', 'ImageUploadField'),
    );

    const getModel = (name: string) =>
      modelWithIdForAdminJS(AdminJSPrisma.getModelByName, name);

    const authConfig = getAuthConfig();

    log('calling AdminModule.createAdminAsyn2');
    const assetsCDN = process.env.ADMIN_JS_ASSETS_CDN;
    const mod = await Promise.resolve(
      AdminModule.createAdminAsync({
        useFactory: (prisma: PrismaService): AdminModuleFactoryOptions => ({
          adminJsOptions: {
            rootPath: '/admin',
            componentLoader,
            resources: buildAdminResources(getModel, prisma),
            ...(assetsCDN && {
              assetsCDN: assetsCDN.endsWith('/') ? assetsCDN : `${assetsCDN}/`,
            }),
            ...(Object.keys(adminConfig.branding).length > 0 && {
              branding: adminConfig.branding,
            }),
          },
          ...authConfig,
        }),
        inject: [PrismaService],
      }),
    );
    log('createAdminAsync done');
    return mod;
  });
