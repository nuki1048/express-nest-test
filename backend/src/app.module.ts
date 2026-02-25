import { Module } from '@nestjs/common';
import { ContactFormModule } from './contact-form/contact-form.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ContactsModule, ContactFormModule],
})
export class AppModule {}
