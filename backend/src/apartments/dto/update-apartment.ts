import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ApartmentTranslations } from '../../locale/locale.types';

export class UpdateApartmentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

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
  @IsString()
  mainPhoto?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @IsOptional()
  @IsObject()
  translations?: Record<string, ApartmentTranslations>;
}
