import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import type { SubmitContactFormDto } from './dto/submit-contact-form.dto';

@Injectable()
export class ContactFormService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async submit(data: SubmitContactFormDto) {
    const submission = await this.prisma.contactFormSubmission.create({
      data: {
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        email: data.email,
        phoneNumber: data.phoneNumber ?? '',
        message: data.message,
      },
    });

    await this.emailService.sendContactFormEmail(data);

    return submission;
  }
}
