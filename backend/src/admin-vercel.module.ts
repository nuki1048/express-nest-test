/**
 * Admin module for Vercel with static imports so the bundler includes adminjs and @adminjs/prisma.
 * Used only when process.env.VERCEL is set.
 */
import type { DynamicModule } from '@nestjs/common';
import { AdminModule, type AdminModuleOptions } from '@adminjs/nestjs';
import AdminJS from 'adminjs';
import * as AdminJSPrisma from '@adminjs/prisma';
import path from 'path';
import { PrismaService } from './prisma/prisma.service';
import { adminConfig } from './admin/config';
import { getAuthConfig } from './admin/auth';
import { buildAdminResources, modelWithIdForAdminJS } from './admin/resources';

// Register adapter so AdminJS can use Prisma (required before createAdminAsync)
AdminJS.registerAdapter({
  Database: AdminJSPrisma.Database,
  Resource: AdminJSPrisma.Resource,
});

// AdminJS.ComponentLoader exists at runtime; types may not expose it fully
const componentLoader = new (
  AdminJS as unknown as {
    ComponentLoader: new () => {
      add: (name: string, filePath: string) => string;
    };
  }
).ComponentLoader();
const adminDir = path.join(__dirname, 'admin');
componentLoader.add(
  'LinksField',
  path.join(adminDir, 'components', 'LinksField.tsx'),
);
componentLoader.add(
  'ImageUploadField',
  path.join(adminDir, 'components', 'ImageUpload', 'ImageUploadField'),
);

const getModel = (name: string) =>
  modelWithIdForAdminJS(AdminJSPrisma.getModelByName, name);

const authConfig = getAuthConfig();

export const adminModulePromise: Promise<DynamicModule> = Promise.resolve(
  AdminModule.createAdminAsync({
    useFactory: (prisma: PrismaService) =>
      ({
        adminJsOptions: {
          rootPath: '/admin',
          componentLoader,
          resources: buildAdminResources(getModel, prisma),
          ...(Object.keys(adminConfig.branding).length > 0 && {
            branding: adminConfig.branding,
          }),
        },
        ...authConfig,
      }) as AdminModuleOptions,
    inject: [PrismaService],
  }),
);
