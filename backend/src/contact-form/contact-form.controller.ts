import { Body, Controller, Post } from '@nestjs/common';
import { ContactFormService } from './contact-form.service';
import { SubmitContactFormDto } from './dto/submit-contact-form.dto';

@Controller('contact-form')
export class ContactFormController {
  constructor(private readonly contactFormService: ContactFormService) {}

  @Post()
  submit(@Body() dto: SubmitContactFormDto) {
    return this.contactFormService.submit(dto);
  }
}
