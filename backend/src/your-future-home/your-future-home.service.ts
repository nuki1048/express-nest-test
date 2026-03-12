/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateYourFutureHomeDto } from './dto/update-your-future-home';
import { CreateYourFutureHomeDto } from './dto/create-your-future-home';
import {
  titleToSlug,
  ensureUniqueSlug,
  getSlugForUpdate,
} from '../utils/slug.utils';
import { localizeRental } from '../locale/locale.helper';
import type { SupportedLocale } from '../locale/locale.types';

type PrismaWithYourFutureHome = PrismaService & {
  yourFutureHome: {
    findMany: (args?: unknown) => Promise<unknown[]>;
    findUnique: (args: unknown) => Promise<unknown>;
    create: (args: unknown) => Promise<unknown>;
    update: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  };
};

@Injectable()
export class YourFutureHomeService {
  constructor(private readonly prisma: PrismaService) {}

  private get db(): PrismaWithYourFutureHome {
    return this.prisma as PrismaWithYourFutureHome;
  }

  private readonly includeVariants = { include: { variants: true } };

  async getYourFutureHomes(
    locale: SupportedLocale = 'en',
    includeTranslations = true,
  ) {
    const items = await this.db.yourFutureHome.findMany(this.includeVariants);
    if (includeTranslations) {
      return items;
    }
    return (items as unknown[]).map((r) =>
      localizeRental(r as Parameters<typeof localizeRental>[0], locale),
    );
  }

  async getYourFutureHome(
    slug: string,
    locale: SupportedLocale = 'en',
    includeTranslations = false,
  ) {
    const item = await this.db.yourFutureHome.findUnique({
      where: { slug },
      include: { variants: true },
    });
    if (!item) {
      throw new NotFoundException('Your future home not found');
    }
    if (includeTranslations) {
      return item;
    }
    return localizeRental(item as Parameters<typeof localizeRental>[0], locale);
  }

  async createYourFutureHome(data: CreateYourFutureHomeDto) {
    const baseSlug =
      titleToSlug(data?.title) || `your-future-home-${Date.now().toString(36)}`;
    const slug = await ensureUniqueSlug(this.db.yourFutureHome, baseSlug);
    const { variants, ...root } = data;
    return this.db.yourFutureHome.create({
      data: {
        ...root,
        slug,
        hasAc: root.hasAc ?? false,
        variants: {
          create: variants.map((v) => ({
            title: v.title,
            description: v.description,
            airbnb: v.airbnb ?? null,
            booking: v.booking ?? null,
            bedrooms: v.bedrooms,
            maxPeople: v.maxPeople,
            couches: v.couches,
            viewFromWindow: v.viewFromWindow,
            hasAc: v.hasAc ?? false,
            photos: v.photos ?? [],
            translations: v.translations ?? undefined,
          })),
        },
      },
      ...this.includeVariants,
    });
  }

  async updateYourFutureHome(slug: string, data: UpdateYourFutureHomeDto) {
    const slugData = await getSlugForUpdate(
      this.db.yourFutureHome,
      data.title,
      slug,
      'your-future-home-',
    );
    const { variants, ...root } = data;

    const updateData: Record<string, unknown> = {
      ...root,
      ...slugData,
    };
    if (root.hasAc !== undefined) updateData.hasAc = root.hasAc ?? false;

    if (variants !== undefined && variants.length > 0) {
      updateData.variants = {
        deleteMany: {},
        create: variants.map((v) => ({
          title: v.title,
          description: v.description,
          airbnb: v.airbnb ?? null,
          booking: v.booking ?? null,
          bedrooms: v.bedrooms,
          maxPeople: v.maxPeople,
          couches: v.couches,
          viewFromWindow: v.viewFromWindow,
          hasAc: v.hasAc ?? false,
          photos: v.photos ?? [],
          translations: v.translations ?? undefined,
        })),
      };
    }

    return this.db.yourFutureHome.update({
      where: { slug },
      data: updateData,
      ...this.includeVariants,
    });
  }

  async deleteYourFutureHome(slug: string) {
    await this.getYourFutureHome(slug);
    return this.db.yourFutureHome.delete({ where: { slug } });
  }
}
