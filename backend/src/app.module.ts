import { Module } from '@nestjs/common';
import { HolidayRentalsModule } from './holiday-rentals/holiday-rentals.module';
import { YourFutureHomeModule } from './your-future-home/your-future-home.module';
import { AuthModule } from './auth/auth.module';
import { BlogPostModule } from './blog-post/blog-post.module';
import { ContactFormModule } from './contact-form/contact-form.module';
import { ContactsModule } from './contacts/contacts.module';
import { LocaleModule } from './locale/locale.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    LocaleModule,
    PrismaModule,
    AuthModule,
    ContactsModule,
    ContactFormModule,
    HolidayRentalsModule,
    YourFutureHomeModule,
    BlogPostModule,
    UploadModule,
  ],
})
export class AppModule {}
