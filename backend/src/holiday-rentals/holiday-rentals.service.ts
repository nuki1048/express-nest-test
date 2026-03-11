import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateHolidayRentalDto } from './dto/update-holiday-rental';
import { CreateHolidayRentalDto } from './dto/create-holiday-rental';
import {
  titleToSlug,
  ensureUniqueSlug,
  getSlugForUpdate,
} from '../utils/slug.utils';
import { localizeRental } from '../locale/locale.helper';
import type { SupportedLocale } from '../locale/locale.types';

type PrismaWithHolidayRental = PrismaService & {
  holidayRental: {
    findMany: (args?: unknown) => Promise<unknown[]>;
    findUnique: (args: unknown) => Promise<unknown>;
    create: (args: unknown) => Promise<unknown>;
    update: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  };
};

@Injectable()
export class HolidayRentalsService {
  constructor(private readonly prisma: PrismaService) {}

  private get db(): PrismaWithHolidayRental {
    return this.prisma as PrismaWithHolidayRental;
  }

  private readonly includeVariants = { include: { variants: true } };

  async getHolidayRentals(
    locale: SupportedLocale = 'en',
    includeTranslations = true,
  ) {
    const rentals = await this.db.holidayRental.findMany(this.includeVariants);
    if (includeTranslations) {
      return rentals;
    }
    return (rentals as unknown[]).map((r) =>
      localizeRental(r as Parameters<typeof localizeRental>[0], locale),
    );
  }

  async getHolidayRental(
    slug: string,
    locale: SupportedLocale = 'en',
    includeTranslations = false,
  ) {
    const rental = await this.db.holidayRental.findUnique({
      where: { slug },
      include: { variants: true },
    });
    if (!rental) {
      throw new NotFoundException('Holiday rental not found');
    }
    if (includeTranslations) {
      return rental;
    }
    return localizeRental(
      rental as Parameters<typeof localizeRental>[0],
      locale,
    );
  }

  async createHolidayRental(data: CreateHolidayRentalDto) {
    const baseSlug =
      titleToSlug(data?.title) || `holiday-rental-${Date.now().toString(36)}`;
    const slug = await ensureUniqueSlug(this.db.holidayRental, baseSlug);
    const { variants, ...root } = data;
    return this.db.holidayRental.create({
      data: {
        ...root,
        slug,
        airbnb: root.airbnb ?? null,
        booking: root.booking ?? null,
        variants: {
          create: variants.map((v) => ({
            bedrooms: v.bedrooms,
            maxPeople: v.maxPeople,
            couches: v.couches,
            showers: v.showers,
            viewFromWindow: v.viewFromWindow,
            hasAc: v.hasAc ?? false,
            photos: v.photos ?? [],
          })),
        },
      },
      ...this.includeVariants,
    });
  }

  async updateHolidayRental(slug: string, data: UpdateHolidayRentalDto) {
    const slugData = await getSlugForUpdate(
      this.db.holidayRental,
      data.title,
      slug,
      'holiday-rental-',
    );
    const { variants, ...root } = data;

    const updateData: Record<string, unknown> = {
      ...root,
      ...slugData,
    };

    if (variants !== undefined && variants.length > 0) {
      updateData.variants = {
        deleteMany: {},
        create: variants.map((v) => ({
          bedrooms: v.bedrooms,
          maxPeople: v.maxPeople,
          couches: v.couches,
          showers: v.showers,
          viewFromWindow: v.viewFromWindow,
          hasAc: v.hasAc ?? false,
          photos: v.photos ?? [],
        })),
      };
    }

    if (root.airbnb !== undefined) updateData.airbnb = root.airbnb ?? null;
    if (root.booking !== undefined) updateData.booking = root.booking ?? null;

    return this.db.holidayRental.update({
      where: { slug },
      data: updateData,
      ...this.includeVariants,
    });
  }

  async deleteHolidayRental(slug: string) {
    await this.getHolidayRental(slug);
    return this.db.holidayRental.delete({ where: { slug } });
  }
}
