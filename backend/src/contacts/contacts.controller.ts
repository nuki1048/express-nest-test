import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  getContact() {
    return this.contactsService.getContact();
  }

  @Patch()
  updateContact(@Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.updateContact(updateContactDto);
  }
}
