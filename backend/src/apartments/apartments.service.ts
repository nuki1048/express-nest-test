import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateApartmentDto } from './dto/update-apartment';
import { CreateApartmentDto } from './dto/create-apartment';
import { titleToSlug } from '../utils/slug.utils';

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

  async getApartments() {
    const apartments = await this.db.apartment.findMany();
    return apartments;
  }

  async getApartment(slug: string) {
    const apartment = await this.db.apartment.findUnique({
      where: { slug },
    });
    if (!apartment) {
      throw new NotFoundException('Apartment not found');
    }
    return apartment;
  }

  private async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 2;
    while (await this.db.apartment.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }
    return slug;
  }

  async createApartment(data: CreateApartmentDto) {
    const baseSlug =
      titleToSlug(data.title) || `apartment-${Date.now().toString(36)}`;
    const slug = await this.ensureUniqueSlug(baseSlug);
    return this.db.apartment.create({
      data: { ...data, slug },
    });
  }

  async updateApartment(slug: string, data: UpdateApartmentDto) {
    return this.db.apartment.update({ where: { slug }, data });
  }

  async deleteApartment(slug: string) {
    await this.getApartment(slug);
    return this.db.apartment.delete({ where: { slug } });
  }
}
