import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  readonly username: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  readonly password: string;
}
