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
import * as express from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { HolidayRentalsService } from './holiday-rentals.service';
import { CreateHolidayRentalDto } from './dto/create-holiday-rental';
import { UpdateHolidayRentalDto } from './dto/update-holiday-rental';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import type { SupportedLocale } from '../locale/locale.types';
import { Locale } from '../locale/locale.decorator';

@Controller('holiday-rentals')
export class HolidayRentalsController {
  constructor(
    private readonly holidayRentalsService: HolidayRentalsService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHolidayRentals(
    @Req() req: express.Request,
    @Locale() locale: SupportedLocale,
  ) {
    const includeTranslations = this.authService.isAdmin(req);
    return this.holidayRentalsService.getHolidayRentals(
      locale,
      includeTranslations,
    );
  }

  @Get(':slug')
  getHolidayRental(
    @Param('slug') slug: string,
    @Req() req: express.Request,
    @Locale() locale: SupportedLocale,
  ) {
    const includeTranslations = this.authService.isAdmin(req);
    return this.holidayRentalsService.getHolidayRental(
      slug,
      locale,
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

  @Post(':slug/bookings')
  @UseGuards(AuthGuard)
  createBooking(@Param('slug') slug: string, @Body() body: CreateBookingDto) {
    return this.holidayRentalsService.createBooking(slug, body);
  }

  @Patch(':slug/bookings/:bookingId')
  @UseGuards(AuthGuard)
  updateBooking(
    @Param('slug') slug: string,
    @Param('bookingId') bookingId: string,
    @Body() body: UpdateBookingDto,
  ) {
    return this.holidayRentalsService.updateBooking(slug, bookingId, body);
  }

  @Delete(':slug/bookings/:bookingId')
  @UseGuards(AuthGuard)
  deleteBooking(
    @Param('slug') slug: string,
    @Param('bookingId') bookingId: string,
  ) {
    return this.holidayRentalsService.deleteBooking(slug, bookingId);
  }
}
