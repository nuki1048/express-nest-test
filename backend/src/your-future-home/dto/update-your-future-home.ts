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
import { CreateYourFutureHomeVariantDto } from './create-rental-variant';

export class UpdateYourFutureHomeDto {
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
  @Type(() => CreateYourFutureHomeVariantDto)
  variants?: CreateYourFutureHomeVariantDto[];

  @IsOptional()
  @IsObject()
  translations?: Record<string, RentalTranslations>;
}
