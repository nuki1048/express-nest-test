import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ContactFormController } from './contact-form.controller';
import { ContactFormSubmissionsController } from './contact-form-submissions.controller';
import { ContactFormService } from './contact-form.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [AuthModule, EmailModule],
  controllers: [ContactFormController, ContactFormSubmissionsController],
  providers: [ContactFormService],
})
export class ContactFormModule {}
