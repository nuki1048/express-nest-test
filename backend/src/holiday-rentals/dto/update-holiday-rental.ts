import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { RentalTranslations } from '../../locale/locale.types';
import { CreateRentalVariantDto } from './create-rental-variant';

export class UpdateHolidayRentalDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  mainPhoto?: string;

  @IsOptional()
  @IsString()
  airbnb?: string;

  @IsOptional()
  @IsString()
  booking?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRentalVariantDto)
  variants?: CreateRentalVariantDto[];

  @IsOptional()
  @IsObject()
  translations?: Record<string, RentalTranslations>;
}
