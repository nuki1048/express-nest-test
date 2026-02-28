import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateBlogPostDto } from './dto/update-blog-post';
import { CreateBlogPostDto } from './dto/create-blog-post';

type PrismaWithBlogPost = PrismaService & {
  blogPost: {
    findMany: (args?: unknown) => Promise<unknown[]>;
    findUnique: (args: unknown) => Promise<unknown>;
    create: (args: unknown) => Promise<unknown>;
    update: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  };
};

@Injectable()
export class BlogPostService {
  constructor(private readonly prisma: PrismaService) {}

  private get db(): PrismaWithBlogPost {
    return this.prisma as PrismaWithBlogPost;
  }

  async getBlogPosts() {
    return this.db.blogPost.findMany();
  }

  async getBlogPost(id: string) {
    const post = await this.db.blogPost.findUnique({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return this.db.blogPost.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async createBlogPost(data: CreateBlogPostDto) {
    return this.db.blogPost.create({ data });
  }

  async updateBlogPost(id: string, data: UpdateBlogPostDto) {
    return this.db.blogPost.update({ where: { id }, data });
  }

  async deleteBlogPost(id: string) {
    await this.getBlogPost(id);
    return this.db.blogPost.delete({ where: { id } });
  }
}
