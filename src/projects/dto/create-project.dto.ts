import { IsNotEmpty, IsOptional, IsMongoId, IsEmail, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class CreateProjectDto {
  @ApiProperty({ description: 'User ID of the project creator' })
  @IsNotEmpty()
  @IsMongoId()
  userId: ObjectId;

  @ApiProperty({ description: 'Email of the project creator' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'URL of the project' })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ description: 'Name of the project', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Categories associated with the project', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ description: 'Target audience of the project', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  audience?: string[];

  @ApiProperty({ description: 'Emotions associated with the project', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emotions?: string[];

  @ApiProperty({ description: 'Purpose of the project', required: false })
  @IsOptional()
  @IsString()
  purpose?: string;
}