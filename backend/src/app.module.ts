// import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ApartmentsModule } from './apartments/apartments.module';
import { BlogPostModule } from './blog-post/blog-post.module';
import { ContactFormModule } from './contact-form/contact-form.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';

// const adminModule: Promise<DynamicModule> | undefined = process.env.VERCEL
//   ? undefined
//   : (
//       require('./admin/admin.module') as {
//         adminModulePromise: Promise<DynamicModule>;
//       }
//     ).adminModulePromise;

@Module({
  imports: [
    PrismaModule,
    ContactsModule,
    ContactFormModule,
    ApartmentsModule,
    BlogPostModule,
    UploadModule,
    // ...(adminModule ? [adminModule] : []),
  ],
})
export class AppModule {}
