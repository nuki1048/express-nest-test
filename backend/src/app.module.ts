import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { adminModulePromise } from './admin-vercel.module';
import { ApartmentsModule } from './apartments/apartments.module';
import { BlogPostModule } from './blog-post/blog-post.module';
import { ContactFormModule } from './contact-form/contact-form.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';

@Module({
  controllers: [AppController],
  imports: [
    PrismaModule,
    ContactsModule,
    ContactFormModule,
    ApartmentsModule,
    BlogPostModule,
    UploadModule,
    adminModulePromise,
  ],
})
export class AppModule {}
