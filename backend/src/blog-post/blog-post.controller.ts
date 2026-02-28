import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

  @Get(':id')
  getBlogPost(@Param('id') id: string) {
    return this.blogPostService.getBlogPost(id);
  }

  @Post()
  createBlogPost(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogPostService.createBlogPost(createBlogPostDto);
  }

  @Patch(':id')
  updateBlogPost(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ) {
    return this.blogPostService.updateBlogPost(id, updateBlogPostDto);
  }

  @Delete(':id')
  deleteBlogPost(@Param('id') id: string) {
    return this.blogPostService.deleteBlogPost(id);
  }
}
