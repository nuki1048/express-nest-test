import type { ContactAddress, ContactLinks } from '../contacts.types';

export class CreateContactDto {
  phoneNumbers: string[];
  email: string;
  address: ContactAddress;
  links?: ContactLinks;
}
