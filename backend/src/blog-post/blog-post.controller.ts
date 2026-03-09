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
import { BlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dto/create-blog-post';
import { UpdateBlogPostDto } from './dto/update-blog-post';
import type { SupportedLocale } from '../locale/locale.types';

@Controller('blog-posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get()
  getBlogPosts(@Req() req: Request & { locale?: SupportedLocale }) {
    return this.blogPostService.getBlogPosts(req.locale ?? 'en');
  }

  @Get(':slug')
  getBlogPost(
    @Param('slug') slug: string,
    @Req() req: Request & { locale?: SupportedLocale },
  ) {
    return this.blogPostService.getBlogPost(slug, req.locale ?? 'en');
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
