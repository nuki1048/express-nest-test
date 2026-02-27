import { DynamicModule, Module } from '@nestjs/common';
import * as path from 'path';
import { ContactFormModule } from './contact-form/contact-form.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { dynamicImport } from './utils/dynamic-import';

const sessionSecret =
  process.env.ADMIN_SESSION_SECRET ?? 'change-me-in-production';
const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'password';

const authenticate =
  sessionSecret !== 'change-me-in-production'
    ? async (email: string, password: string) => {
        if (email === adminEmail && password === adminPassword) {
          return Promise.resolve({ email, password });
        }
        return null;
      }
    : undefined;

type PrismaDmmfModel = { name: string; fields: Array<Record<string, unknown>> };

/** Prisma 7 DMMF fields omit isId; AdminJS Prisma adapter expects it. Normalize so the id field has isId: true. */
function modelWithIdForAdminJS(
  getModelByName: (name: string) => PrismaDmmfModel,
  modelName: string,
): PrismaDmmfModel {
  const model = getModelByName(modelName);
  return {
    ...model,
    fields: model.fields.map((f) =>
      f.name === 'id' ? { ...f, isId: true } : f,
    ),
  };
}

const adminModulePromise: Promise<DynamicModule> = dynamicImport<{
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
  componentLoader.add(
    'LinksField',
    path.join(process.cwd(), 'src', 'admin', 'LinksField'),
  );

  const getModel = (name: string) =>
    modelWithIdForAdminJS(AdminJSPrisma.getModelByName, name);
  return AdminModule.createAdminAsync({
    useFactory: (prisma: PrismaService) => ({
      adminJsOptions: {
        rootPath: '/admin',
        componentLoader,
        resources: [
          {
            resource: {
              model: getModel('Contact'),
              client: prisma,
            },
            options: {
              properties: {
                phoneNumbers: { isArray: true },
                links: {
                  type: 'json',
                  components: {
                    edit: 'LinksField',
                    show: 'LinksField',
                  },
                },
              },
            },
          },
          {
            resource: {
              model: getModel('ContactFormSubmission'),
              client: prisma,
            },
            options: {},
          },
        ],
      },
      ...(authenticate && {
        auth: {
          authenticate,
          cookieName: 'adminjs',
          cookiePassword: sessionSecret,
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: sessionSecret,
        },
      }),
    }),
    inject: [PrismaService],
  });
});

@Module({
  imports: [
    PrismaModule,
    ContactsModule,
    ContactFormModule,
    adminModulePromise,
  ],
})
export class AppModule {}
