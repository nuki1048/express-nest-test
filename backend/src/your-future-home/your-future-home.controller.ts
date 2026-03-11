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
import { YourFutureHomeService } from './your-future-home.service';
import { CreateYourFutureHomeDto } from './dto/create-your-future-home';
import { UpdateYourFutureHomeDto } from './dto/update-your-future-home';
import type { SupportedLocale } from '../locale/locale.types';

@Controller('your-future-home')
export class YourFutureHomeController {
  constructor(
    private readonly yourFutureHomeService: YourFutureHomeService,
    private readonly authService: AuthService,
  ) {}

  private isAdmin(req: Request): boolean {
    const token = (req.headers?.authorization ?? '').replace(/^Bearer\s+/i, '');
    return !!token && !!this.authService.verifyToken(token);
  }

  @Get()
  getYourFutureHomes(@Req() req: Request & { locale?: SupportedLocale }) {
    const includeTranslations = this.isAdmin(req);
    return this.yourFutureHomeService.getYourFutureHomes(
      req.locale ?? 'en',
      includeTranslations,
    );
  }

  @Get(':slug')
  getYourFutureHome(
    @Param('slug') slug: string,
    @Req() req: Request & { locale?: SupportedLocale },
  ) {
    const includeTranslations = this.isAdmin(req);
    return this.yourFutureHomeService.getYourFutureHome(
      slug,
      req.locale ?? 'en',
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
