/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import type { CreateRentalVariantDto } from './dto/create-rental-variant';

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

  private readonly includeVariants = {
    include: {
      variants: {
        include: { bookings: true },
      },
    },
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private async getVariantIdsForRental(slug: string): Promise<Set<string>> {
    const rental = await this.db.holidayRental.findUnique({
      where: { slug },
      select: { variants: { select: { id: true } } },
    });
    if (!rental) {
      throw new NotFoundException('Holiday rental not found');
    }
    const variants = rental.variants as { id: string }[];
    return new Set(variants.map((v) => v.id));
  }

  private async assertVariantBelongsToRental(
    slug: string,
    variantId: string,
  ): Promise<void> {
    const variantIds = await this.getVariantIdsForRental(slug);
    if (!variantIds.has(variantId)) {
      throw new NotFoundException('Variant not found for this rental');
    }
  }

  private async assertBookingBelongsToRental(
    slug: string,
    bookingId: string,
  ): Promise<{ holidayRentalVariantId: string }> {
    const variantIds = await this.getVariantIdsForRental(slug);
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (!variantIds.has(booking.holidayRentalVariantId)) {
      throw new NotFoundException('Booking not found for this rental');
    }
    return booking;
  }

  private buildBookingUpdateData(data: {
    startDate?: string;
    endDate?: string;
    guestName?: string;
    notes?: string;
  }) {
    const fields: Array<[keyof typeof data, (v: unknown) => unknown]> = [
      ['startDate', (v) => new Date(v as string)],
      ['endDate', (v) => new Date(v as string)],
      ['guestName', (v) => v ?? null],
      ['notes', (v) => v ?? null],
    ];
    return Object.fromEntries(
      fields
        .filter(([key]) => data[key] !== undefined)
        .map(([key, fn]) => [key, fn(data[key])]),
    );
  }

  private buildVariantData(v: CreateRentalVariantDto) {
    return {
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
    };
  }

  private async deleteOrphanedVariants(
    existingVariantIds: Set<string>,
    payloadIds: Set<string>,
  ): Promise<void> {
    const toDelete = [...existingVariantIds].filter(
      (id) => !payloadIds.has(id),
    );
    if (toDelete.length === 0) return;

    await this.prisma.booking.deleteMany({
      where: { holidayRentalVariantId: { in: toDelete } },
    });
    await this.prisma.holidayRentalVariant.deleteMany({
      where: { id: { in: toDelete } },
    });
  }

  private async syncVariants(
    slug: string,
    variants: CreateRentalVariantDto[],
  ): Promise<void> {
    const payloadIds = new Set(
      variants.map((v) => v.id).filter((id): id is string => !!id),
    );

    const existingRental = await this.db.holidayRental.findUnique({
      where: { slug },
      select: { id: true, variants: { select: { id: true } } },
    });
    if (!existingRental) {
      throw new NotFoundException('Holiday rental not found');
    }

    const existingVariantIds = new Set(
      (existingRental.variants as { id: string }[]).map((v) => v.id),
    );
    await this.deleteOrphanedVariants(existingVariantIds, payloadIds);

    for (const v of variants) {
      const variantData = this.buildVariantData(v);
      if (v.id) {
        await this.prisma.holidayRentalVariant.update({
          where: { id: v.id },
          data: variantData,
        });
      } else {
        await this.prisma.holidayRentalVariant.create({
          data: {
            ...variantData,
            holidayRentalId: existingRental.id,
          },
        });
      }
    }
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  async getHolidayRentals(
    locale: SupportedLocale = 'en',
    includeTranslations = true,
  ) {
    const rentals = await this.db.holidayRental.findMany(this.includeVariants);
    if (includeTranslations) {
      return rentals;
    }
    return rentals.map((r) =>
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
      ...this.includeVariants,
    });
    if (!rental) {
      throw new NotFoundException('Holiday rental not found');
    }
    if (includeTranslations) {
      return rental;
    }
    return localizeRental(
      rental as unknown as Parameters<typeof localizeRental>[0],
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
        hasAc: root.hasAc ?? false,
        variants: {
          create: variants.map((v) => this.buildVariantData(v)),
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

    const { hasAc, ...rest } = root;
    const updateData: Record<string, unknown> = {
      ...rest,
      ...slugData,
      ...(hasAc !== undefined && { hasAc: hasAc ?? false }),
    };

    if (variants !== undefined && variants.length > 0) {
      await this.syncVariants(slug, variants);
    }

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

  async createBooking(
    slug: string,
    data: { holidayRentalVariantId: string } & {
      startDate: string;
      endDate: string;
      guestName?: string;
      notes?: string;
    },
  ) {
    await this.assertVariantBelongsToRental(slug, data.holidayRentalVariantId);
    return this.prisma.booking.create({
      data: {
        holidayRentalVariantId: data.holidayRentalVariantId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        guestName: data.guestName ?? null,
        notes: data.notes ?? null,
      },
    });
  }

  async deleteBooking(slug: string, bookingId: string) {
    await this.assertBookingBelongsToRental(slug, bookingId);
    return this.prisma.booking.delete({ where: { id: bookingId } });
  }

  async updateBooking(
    slug: string,
    bookingId: string,
    data: {
      startDate?: string;
      endDate?: string;
      guestName?: string;
      notes?: string;
    },
  ) {
    await this.assertBookingBelongsToRental(slug, bookingId);
    const updateData = this.buildBookingUpdateData(data);
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });
  }
}
