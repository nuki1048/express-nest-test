import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateApartmentDto } from './dto/update-apartment';
import { CreateApartmentDto } from './dto/create-apartment';

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
  async getApartment(id: string) {
    const apartment = await this.db.apartment.findUnique({
      where: { id },
    });
    if (!apartment) {
      throw new NotFoundException('Apartment not found');
    }
    return apartment;
  }

  async createApartment(data: CreateApartmentDto) {
    return this.db.apartment.create({ data });
  }

  async updateApartment(id: string, data: UpdateApartmentDto) {
    return this.db.apartment.update({ where: { id }, data });
  }

  async deleteApartment(id: string) {
    await this.getApartment(id);
    return this.db.apartment.delete({ where: { id } });
  }
}
