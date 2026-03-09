import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateApartmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

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

  @IsString()
  mainPhoto: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}
