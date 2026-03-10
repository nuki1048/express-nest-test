import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import type { BlogPostTranslations } from '../../locale/locale.types';

export class UpdateBlogPostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  mainPhoto?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  views?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  likes?: number;

  @IsOptional()
  @IsObject()
  translations?: Record<string, BlogPostTranslations>;
}
