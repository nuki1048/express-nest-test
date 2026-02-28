import { Module } from '@nestjs/common';
import { adminModulePromise } from './admin/admin.module';
import { ApartmentsModule } from './apartments/apartments.module';
import { BlogPostModule } from './blog-post/blog-post.module';
import { ContactFormModule } from './contact-form/contact-form.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ContactsModule,
    ContactFormModule,
    ApartmentsModule,
    BlogPostModule,
    adminModulePromise,
  ],
})
export class AppModule {}
