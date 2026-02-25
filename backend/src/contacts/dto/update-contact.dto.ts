import type { ContactLinks } from '../contacts.types';

export class UpdateContactDto {
  phoneNumbers?: string[];
  email?: string;
  address?: string;
  links?: ContactLinks;
}
