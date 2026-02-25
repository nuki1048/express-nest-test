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
    const payload = {
      phoneNumbers: data.phoneNumbers ?? [],
      email: data.email ?? '',
      address: data.address ?? '',
      links: data.links,
    };
    const update = Object.fromEntries(
      (Object.entries(data) as [keyof UpdateContactDto, unknown][]).filter(
        ([, v]) => v !== undefined,
      ),
    );
    return this.db.contact.upsert({
      where: { id: CONTACT_SINGLETON_ID },
      create: { id: CONTACT_SINGLETON_ID, ...payload },
      update,
    });
  }
}
