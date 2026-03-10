import { IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type { ContactAddress, ContactLinks } from '../contacts.types';

class ContactAddressDto {
  @IsString()
  label: string;

  @IsString()
  url: string;
}

class ContactLinksDto {
  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  airbnb?: string;

  @IsOptional()
  @IsString()
  booking?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;
}

export class UpdateContactDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phoneNumbers?: string[];

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactAddressDto)
  address?: ContactAddress;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactLinksDto)
  links?: ContactLinks;
}
