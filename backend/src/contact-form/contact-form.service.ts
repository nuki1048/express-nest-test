import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { SubmitContactFormDto } from './dto/submit-contact-form.dto';

@Injectable()
export class ContactFormService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(data: SubmitContactFormDto) {
    return this.prisma.contactFormSubmission.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        message: data.message,
      },
    });
  }
}
