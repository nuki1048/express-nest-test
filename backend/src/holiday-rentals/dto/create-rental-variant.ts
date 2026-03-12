import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import type { RentalVariantTranslations } from '../../locale/locale.types';

export class CreateRentalVariantDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  airbnb?: string;

  @IsOptional()
  @IsString()
  booking?: string;

  @Type(() => Number)
  @IsNumber()
  bedrooms: number;

  @Type(() => Number)
  @IsNumber()
  maxPeople: number;

  @Type(() => Number)
  @IsNumber()
  couches: number;

  @IsString()
  viewFromWindow: string;

  @IsBoolean()
  hasAc: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @IsOptional()
  @IsObject()
  translations?: Record<string, RentalVariantTranslations>;
}
