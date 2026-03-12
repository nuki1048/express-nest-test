import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContactFormSubmissionsService } from './contact-form-submissions.service';

@Controller('contact-form-submissions')
@UseGuards(AuthGuard)
export class ContactFormSubmissionsController {
  constructor(
    private readonly contactFormSubmissionsService: ContactFormSubmissionsService,
  ) {}

  @Get()
  getList(@Query('page') page = '1', @Query('limit') limit = '10') {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.contactFormSubmissionsService.getList(pageNum, limitNum);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.contactFormSubmissionsService.getOne(id);
  }
}
