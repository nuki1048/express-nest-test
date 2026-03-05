import type { ContactAddress, ContactLinks } from '../contacts.types';

export class UpdateContactDto {
  phoneNumbers?: string[];
  email?: string;
  address?: ContactAddress;
  links?: ContactLinks;
}
