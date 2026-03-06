import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dto/create-blog-post';
import { UpdateBlogPostDto } from './dto/update-blog-post';

@Controller('blog-posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get()
  getBlogPosts() {
    return this.blogPostService.getBlogPosts();
  }

  @Get(':slug')
  getBlogPost(@Param('slug') slug: string) {
    return this.blogPostService.getBlogPost(slug);
  }

  @Post()
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
  deleteBlogPost(@Param('slug') slug: string) {
    return this.blogPostService.deleteBlogPost(slug);
  }
}
