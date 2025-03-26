import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  readonly username?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak - it must include uppercase, lowercase and a number',
  })
  readonly password?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email format is invalid' })
  readonly email?: string;

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  readonly firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  readonly lastName?: string;

  @IsOptional()
  @IsString({ message: 'Picture URL must be a string' })
  readonly picture?: string;
}
