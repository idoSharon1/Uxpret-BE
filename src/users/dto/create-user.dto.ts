import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  readonly username: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak - it must include uppercase, lowercase and a number',
  })
  readonly password?: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Email format is invalid' })
  readonly email: string;

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  readonly firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  readonly lastName?: string;

  @IsOptional()
  @IsString({ message: 'Google ID must be a string' })
  readonly googleId?: string;

  @IsOptional()
  @IsString({ message: 'Picture URL must be a string' })
  readonly picture?: string;
}
