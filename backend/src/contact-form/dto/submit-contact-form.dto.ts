import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class SubmitContactFormDto {
  @IsOptional()
  @ValidateIf((o) => (o.firstName?.length ?? 0) > 0)
  @MinLength(2, {
    message: 'firstName must be at least 2 characters when provided',
  })
  firstName?: string;

  @IsOptional()
  @ValidateIf((o) => (o.lastName?.length ?? 0) > 0)
  @MinLength(2, {
    message: 'lastName must be at least 2 characters when provided',
  })
  lastName?: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsOptional()
  @ValidateIf((o) => (o.phoneNumber?.length ?? 0) > 0)
  @MinLength(8, {
    message: 'phoneNumber must be at least 8 characters when provided',
  })
  phoneNumber?: string;

  @IsNotEmpty({ message: 'message is required' })
  @MinLength(10, {
    message: 'message must be at least 10 characters',
  })
  message: string;
}
