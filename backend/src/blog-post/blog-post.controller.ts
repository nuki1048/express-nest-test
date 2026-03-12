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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import * as express from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { BlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dto/create-blog-post';
import { UpdateBlogPostDto } from './dto/update-blog-post';
import type { SupportedLocale } from '../locale/locale.types';
import { Locale } from '../locale/locale.decorator';

@Controller('blog-posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getBlogPosts(@Req() req: express.Request, @Locale() locale: SupportedLocale) {
    const includeTranslations = this.authService.isAdmin(req);
    return this.blogPostService.getBlogPosts(locale, includeTranslations);
  }

  @Get(':slug')
  async getBlogPost(
    @Param('slug') slug: string,
    @Req() req: express.Request,
    @Locale() locale: SupportedLocale,
  ) {
    const includeTranslations = this.authService.isAdmin(req);
    return this.blogPostService.getBlogPost(slug, locale, {
      includeTranslations,
      skipViewIncrement: includeTranslations,
    });
  }

  @Post()
  @UseGuards(AuthGuard)
  createBlogPost(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogPostService.createBlogPost(createBlogPostDto);
  }

  @Patch(':slug')
  @UsePipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  )
  updateBlogPost(
    @Param('slug') slug: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ) {
    return this.blogPostService.updateBlogPost(slug, updateBlogPostDto);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  deleteBlogPost(@Param('slug') slug: string) {
    return this.blogPostService.deleteBlogPost(slug);
  }
}
