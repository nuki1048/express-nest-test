import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApartmentsModule } from './apartments/apartments.module';
import { BlogPostModule } from './blog-post/blog-post.module';
import { ContactFormModule } from './contact-form/contact-form.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';

// Skip loading AdminJS on Vercel so serverless cold start stays under the timeout.
/* eslint-disable @typescript-eslint/no-require-imports -- load admin only when not on Vercel */
const adminModule: Promise<DynamicModule> | undefined = process.env.VERCEL
  ? undefined
  : (
      require('./admin/admin.module') as {
        adminModulePromise: Promise<DynamicModule>;
      }
    ).adminModulePromise;
/* eslint-enable @typescript-eslint/no-require-imports */

@Module({
  controllers: [AppController],
  imports: [
    PrismaModule,
    ContactsModule,
    ContactFormModule,
    ApartmentsModule,
    BlogPostModule,
    UploadModule,
    ...(adminModule ? [adminModule] : []),
  ],
})
export class AppModule {}
