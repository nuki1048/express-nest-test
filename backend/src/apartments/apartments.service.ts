import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateApartmentDto } from './dto/update-apartment';
import { CreateApartmentDto } from './dto/create-apartment';
import {
  titleToSlug,
  ensureUniqueSlug,
  getSlugForUpdate,
} from '../utils/slug.utils';
import { localizeApartment } from '../locale/locale.helper';
import type { SupportedLocale } from '../locale/locale.types';

type PrismaWithApartment = PrismaService & {
  apartment: {
    findMany: (args?: unknown) => Promise<unknown[]>;
    findUnique: (args: unknown) => Promise<unknown>;
    create: (args: unknown) => Promise<unknown>;
    update: (args: unknown) => Promise<unknown>;
    delete: (args: unknown) => Promise<unknown>;
  };
};

@Injectable()
export class ApartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  private get db(): PrismaWithApartment {
    return this.prisma as PrismaWithApartment;
  }

  async getApartments(
    locale: SupportedLocale = 'en',
    includeTranslations = true,
  ) {
    const apartments = await this.db.apartment.findMany();
    if (includeTranslations) {
      return apartments;
    }
    return apartments.map((a) =>
      localizeApartment(a as Parameters<typeof localizeApartment>[0], locale),
    );
  }

  async getApartment(
    slug: string,
    locale: SupportedLocale = 'en',
    includeTranslations = false,
  ) {
    const apartment = await this.db.apartment.findUnique({
      where: { slug },
    });
    if (!apartment) {
      throw new NotFoundException('Apartment not found');
    }
    if (includeTranslations) {
      return apartment;
    }
    return localizeApartment(
      apartment as Parameters<typeof localizeApartment>[0],
      locale,
    );
  }

  async createApartment(data: CreateApartmentDto) {
    const baseSlug =
      titleToSlug(data?.title) || `apartment-${Date.now().toString(36)}`;
    const slug = await ensureUniqueSlug(this.db.apartment, baseSlug);
    return this.db.apartment.create({
      data: {
        ...data,
        slug,
        photos: data.photos ?? [],
      },
    });
  }

  async updateApartment(slug: string, data: UpdateApartmentDto) {
    const slugData = await getSlugForUpdate(
      this.db.apartment,
      data.title,
      slug,
      'apartment-',
    );
    return this.db.apartment.update({
      where: { slug },
      data: { ...data, ...slugData },
    });
  }

  async deleteApartment(slug: string) {
    await this.getApartment(slug);
    return this.db.apartment.delete({ where: { slug } });
  }
}
