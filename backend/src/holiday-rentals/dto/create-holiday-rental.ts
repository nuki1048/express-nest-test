import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateRentalVariantDto } from './create-rental-variant';

export class CreateHolidayRentalDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  mainPhoto: string;

  @IsOptional()
  @IsString()
  airbnb?: string;

  @IsOptional()
  @IsString()
  booking?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRentalVariantDto)
  variants: CreateRentalVariantDto[];
}
