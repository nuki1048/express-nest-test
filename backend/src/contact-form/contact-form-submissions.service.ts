import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactFormSubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getList(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contactFormSubmission.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactFormSubmission.count(),
    ]);
    return { data, total };
  }

  async getOne(id: string) {
    return this.prisma.contactFormSubmission.findUniqueOrThrow({
      where: { id },
    });
  }
}
