import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateContactDto } from './dto/update-contact.dto';

type PrismaWithContact = PrismaService & {
  contact: {
    findUnique: (args: unknown) => Promise<unknown>;
    update: (args: unknown) => Promise<unknown>;
    upsert: (args: unknown) => Promise<unknown>;
  };
};

export const CONTACT_SINGLETON_ID = 'default';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  private get db(): PrismaWithContact {
    return this.prisma as PrismaWithContact;
  }

  async getContact() {
    const contact = await this.db.contact.findUnique({
      where: { id: CONTACT_SINGLETON_ID },
    });
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return contact;
  }

  async updateContact(data: UpdateContactDto) {
    const phoneNumbers = (data.phoneNumbers ?? []).filter(Boolean);
    const createPayload = {
      phoneNumbers,
      email: data.email ?? '',
      address: data.address ?? { label: '', url: '' },
      links: data.links,
    };
    const updatePayload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    ) as Partial<UpdateContactDto>;
    return this.db.contact.upsert({
      where: { id: CONTACT_SINGLETON_ID },
      create: { id: CONTACT_SINGLETON_ID, ...createPayload },
      update: updatePayload,
    });
  }
}
