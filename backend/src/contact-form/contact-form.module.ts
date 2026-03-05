import { Module } from '@nestjs/common';
import { ContactFormController } from './contact-form.controller';
import { ContactFormService } from './contact-form.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [ContactFormController],
  providers: [ContactFormService],
})
export class ContactFormModule {}
