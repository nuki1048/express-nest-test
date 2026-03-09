import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateBlogPostDto } from './dto/update-blog-post';
import { CreateBlogPostDto } from './dto/create-blog-post';
import {
  titleToSlug,
  ensureUniqueSlug,
  getSlugForUpdate,
} from '../utils/slug.utils';
import { localizeBlogPost } from '../locale/locale.helper';
import type { SupportedLocale } from '../locale/locale.types';

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

  async getBlogPosts(locale: SupportedLocale = 'en') {
    const posts = await this.db.blogPost.findMany();
    return posts.map((p) =>
      localizeBlogPost(p as Parameters<typeof localizeBlogPost>[0], locale),
    );
  }

  async getBlogPost(slug: string, locale: SupportedLocale = 'en') {
    const post = await this.db.blogPost.findUnique({
      where: { slug },
    });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    const updated = await this.db.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
    return localizeBlogPost(
      updated as Parameters<typeof localizeBlogPost>[0],
      locale,
    );
  }

  async createBlogPost(data: CreateBlogPostDto) {
    const baseSlug =
      titleToSlug(data.title) || `blog-post-${Date.now().toString(36)}`;
    const slug = await ensureUniqueSlug(this.db.blogPost, baseSlug);
    return this.db.blogPost.create({
      data: { ...data, slug },
    });
  }

  async updateBlogPost(slug: string, data: UpdateBlogPostDto) {
    const slugData = await getSlugForUpdate(
      this.db.blogPost,
      data.title,
      slug,
      'blog-post-',
    );
    return this.db.blogPost.update({
      where: { slug },
      data: { ...data, ...slugData },
    });
  }

  async deleteBlogPost(slug: string) {
    await this.getBlogPost(slug);
    return this.db.blogPost.delete({ where: { slug } });
  }
}
