import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateYourFutureHomeVariantDto } from './create-rental-variant';

export class CreateYourFutureHomeDto {
  @IsString()
  title: string;

  @IsString()
  mainPhoto: string;

  @Type(() => Number)
  @IsNumber()
  bedrooms: number;

  @Type(() => Number)
  @IsNumber()
  maxPeople: number;

  @Type(() => Number)
  @IsNumber()
  couches: number;

  @Type(() => Number)
  @IsNumber()
  showers: number;

  @IsString()
  viewFromWindow: string;

  @IsBoolean()
  hasAc: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateYourFutureHomeVariantDto)
  variants: CreateYourFutureHomeVariantDto[];
}
