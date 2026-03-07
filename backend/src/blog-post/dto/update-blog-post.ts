import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

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
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  views?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  likes?: number;
}
