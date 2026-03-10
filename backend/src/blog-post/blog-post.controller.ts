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
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { BlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dto/create-blog-post';
import { UpdateBlogPostDto } from './dto/update-blog-post';
import type { SupportedLocale } from '../locale/locale.types';

function isAdminRequest(req: Request): boolean {
  const authHeader = req.headers?.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  return !!token;
}

@Controller('blog-posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService,
    private readonly authService: AuthService,
  ) {}

  private isAdmin(req: Request): boolean {
    const token = (req.headers?.authorization ?? '').replace(/^Bearer\s+/i, '');
    return !!token && !!this.authService.verifyToken(token);
  }

  @Get()
  async getBlogPosts(@Req() req: Request & { locale?: SupportedLocale }) {
    const includeTranslations = this.isAdmin(req);
    return this.blogPostService.getBlogPosts(
      req.locale ?? 'en',
      includeTranslations,
    );
  }

  @Get(':slug')
  async getBlogPost(
    @Param('slug') slug: string,
    @Req() req: Request & { locale?: SupportedLocale },
  ) {
    const includeTranslations = this.isAdmin(req);
    return this.blogPostService.getBlogPost(slug, req.locale ?? 'en', {
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
  @UseGuards(AuthGuard)
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
