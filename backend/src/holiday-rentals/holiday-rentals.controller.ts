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
import { AuthService } from '../auth/auth.service';
import { HolidayRentalsService } from './holiday-rentals.service';
import { CreateHolidayRentalDto } from './dto/create-holiday-rental';
import { UpdateHolidayRentalDto } from './dto/update-holiday-rental';
import type { SupportedLocale } from '../locale/locale.types';

@Controller('holiday-rentals')
export class HolidayRentalsController {
  constructor(
    private readonly holidayRentalsService: HolidayRentalsService,
    private readonly authService: AuthService,
  ) {}

  private isAdmin(req: Request): boolean {
    const token = (req.headers?.authorization ?? '').replace(/^Bearer\s+/i, '');
    return !!token && !!this.authService.verifyToken(token);
  }

  @Get()
  getHolidayRentals(@Req() req: Request & { locale?: SupportedLocale }) {
    const includeTranslations = this.isAdmin(req);
    return this.holidayRentalsService.getHolidayRentals(
      req.locale ?? 'en',
      includeTranslations,
    );
  }

  @Get(':slug')
  getHolidayRental(
    @Param('slug') slug: string,
    @Req() req: Request & { locale?: SupportedLocale },
  ) {
    const includeTranslations = this.isAdmin(req);
    return this.holidayRentalsService.getHolidayRental(
      slug,
      req.locale ?? 'en',
      includeTranslations,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  createHolidayRental(@Body() createDto: CreateHolidayRentalDto) {
    return this.holidayRentalsService.createHolidayRental(createDto);
  }

  @Patch(':slug')
  @UseGuards(AuthGuard)
  updateHolidayRental(
    @Param('slug') slug: string,
    @Body() updateDto: UpdateHolidayRentalDto,
  ) {
    return this.holidayRentalsService.updateHolidayRental(slug, updateDto);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  deleteHolidayRental(@Param('slug') slug: string) {
    return this.holidayRentalsService.deleteHolidayRental(slug);
  }
}
