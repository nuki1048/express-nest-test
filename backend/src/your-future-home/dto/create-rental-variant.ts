import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateYourFutureHomeVariantDto {
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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}
