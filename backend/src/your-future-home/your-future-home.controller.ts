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
import { YourFutureHomeService } from './your-future-home.service';
import { CreateYourFutureHomeDto } from './dto/create-your-future-home';
import { UpdateYourFutureHomeDto } from './dto/update-your-future-home';
import type { SupportedLocale } from '../locale/locale.types';
import { Locale } from '../locale/locale.decorator';

@Controller('your-future-home')
export class YourFutureHomeController {
  constructor(
    private readonly yourFutureHomeService: YourFutureHomeService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getYourFutureHomes(
    @Req() req: express.Request,
    @Locale() locale: SupportedLocale,
  ) {
    const includeTranslations = this.authService.isAdmin(req);
    return this.yourFutureHomeService.getYourFutureHomes(
      locale,
      includeTranslations,
    );
  }

  @Get(':slug')
  getYourFutureHome(
    @Param('slug') slug: string,
    @Req() req: express.Request,
    @Locale() locale: SupportedLocale,
  ) {
    const includeTranslations = this.authService.isAdmin(req);
    return this.yourFutureHomeService.getYourFutureHome(
      slug,
      locale,
      includeTranslations,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  createYourFutureHome(@Body() createDto: CreateYourFutureHomeDto) {
    return this.yourFutureHomeService.createYourFutureHome(createDto);
  }

  @Patch(':slug')
  @UseGuards(AuthGuard)
  updateYourFutureHome(
    @Param('slug') slug: string,
    @Body() updateDto: UpdateYourFutureHomeDto,
  ) {
    return this.yourFutureHomeService.updateYourFutureHome(slug, updateDto);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  deleteYourFutureHome(@Param('slug') slug: string) {
    return this.yourFutureHomeService.deleteYourFutureHome(slug);
  }
}
