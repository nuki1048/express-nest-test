import type { ContactLinks } from '../contacts.types';

export class CreateContactDto {
  phoneNumbers: string[];
  email: string;
  address: string;
  links?: ContactLinks;
}
