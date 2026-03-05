import { Injectable, Logger } from '@nestjs/common';
import { send as emailjsSend } from '@emailjs/nodejs';
import type { SubmitContactFormDto } from '../contact-form/dto/submit-contact-form.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendContactFormEmail(data: SubmitContactFormDto): Promise<void> {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      this.logger.warn('EmailJS env vars are not configured — skipping email');
      return;
    }

    try {
      await emailjsSend(
        serviceId,
        templateId,
        {
          from_name:
            `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() ||
            'Anonymous',
          from_email: data.email,
          phone_number: data.phoneNumber ?? '—',
          message: data.message,
        },
        { publicKey, privateKey },
      );
      this.logger.log(`Contact form email sent for ${data.email}`);
    } catch (err) {
      this.logger.error('Failed to send contact form email', err);
    }
  }
}
