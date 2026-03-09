import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('contact-form-submissions')
@UseGuards(AuthGuard)
export class ContactFormSubmissionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getList(@Query('page') page = '1', @Query('limit') limit = '10') {
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);
    const [data, total] = await Promise.all([
      this.prisma.contactFormSubmission.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactFormSubmission.count(),
    ]);
    return { data, total };
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.prisma.contactFormSubmission.findUniqueOrThrow({
      where: { id },
    });
  }
}
