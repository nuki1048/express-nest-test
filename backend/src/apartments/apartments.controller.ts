import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment';
import { UpdateApartmentDto } from './dto/update-apartment';
import type { SupportedLocale } from '../locale/locale.types';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get()
  getApartments(@Req() req: Request & { locale?: SupportedLocale }) {
    return this.apartmentsService.getApartments(req.locale ?? 'en');
  }

  @Get(':slug')
  getApartment(
    @Param('slug') slug: string,
    @Req() req: Request & { locale?: SupportedLocale },
  ) {
    return this.apartmentsService.getApartment(slug, req.locale ?? 'en');
  }

  @Post()
  @UseGuards(AuthGuard)
  createApartment(@Body() createApartmentDto: CreateApartmentDto) {
    return this.apartmentsService.createApartment(createApartmentDto);
  }

  @Patch(':slug')
  @UseGuards(AuthGuard)
  updateApartment(
    @Param('slug') slug: string,
    @Body() updateApartmentDto: UpdateApartmentDto,
  ) {
    return this.apartmentsService.updateApartment(slug, updateApartmentDto);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  deleteApartment(@Param('slug') slug: string) {
    return this.apartmentsService.deleteApartment(slug);
  }
}
