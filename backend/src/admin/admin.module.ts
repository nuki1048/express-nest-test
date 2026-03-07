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

export const adminModulePromise: Promise<DynamicModule> = dynamicImport<{
  AdminModule: { createAdminAsync: (config: unknown) => DynamicModule };
}>('@adminjs/nestjs').then(async ({ AdminModule }) => {
  const AdminJSPrisma = await dynamicImport<{
    getModelByName: (name: string) => PrismaDmmfModel;
  }>('@adminjs/prisma');
  const adminjs = await dynamicImport<{
    ComponentLoader: new () => {
      add: (name: string, filePath: string) => string;
    };
  }>('adminjs');
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

  return AdminModule.createAdminAsync({
    useFactory: (prisma: PrismaService): AdminModuleFactoryOptions => ({
      adminJsOptions: {
        rootPath: '/admin',
        componentLoader,
        resources: buildAdminResources(getModel, prisma),
        ...(Object.keys(adminConfig.branding).length > 0 && {
          branding: adminConfig.branding,
        }),
      },
      ...authConfig,
    }),
    inject: [PrismaService],
  });
});
