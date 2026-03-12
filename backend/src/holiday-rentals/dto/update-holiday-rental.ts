import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
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
  mainPhoto?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPeople?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  couches?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  showers?: number;

  @IsOptional()
  @IsString()
  viewFromWindow?: string;

  @IsOptional()
  @IsBoolean()
  hasAc?: boolean;

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
