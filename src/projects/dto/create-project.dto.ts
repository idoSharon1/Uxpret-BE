import { IsNotEmpty, IsOptional, IsMongoId, IsEmail, IsArray, IsString, IsUrl, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class CreateProjectDto {
  @ApiProperty({ description: 'User ID of the project creator' })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({ description: 'Email of the project creator' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'https://www.colman.ac.il/',
    description: 'Website Url',
  })
  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsUrl({}, { message: 'Invalid URL format' })
  url: string;

  @ApiProperty({ example: 'www.colman.ac.il', description: 'Website name', required: false })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    example: '["Programming","Social Media"]',
    description: 'Website categories',
    required: false
  })
  @IsOptional()
  @IsArray({ message: 'categories must be a string array' })
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({
    example: '["Adults","Teens"]',
    description: 'Website audience',
    required: false
  })
  @IsOptional()
  @IsArray({ message: 'audience must be a string array' })
  @IsString({ each: true })
  audience: string[];

  @ApiProperty({
    example: '["Professional", "Security & Trust"]',
    description: 'Website emotions',
    required: false
  })
  @IsOptional()
  @IsArray({ message: 'emotions must be a string array' })
  @IsString({ each: true })
  emotions: string[];

  @ApiProperty({
    example: 'Website for academic studies',
    description: 'Website purpose',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'purpose must be a string' })
  purpose: string;

  @ApiProperty({ example: 'false', description: 'to include screenshot?', required: false })
  @IsOptional()
  @IsBoolean({ message: 'Include screenshots must be a boolean' })
  includeScreenshots?: boolean;

  @ApiProperty({ example: 'false', description: 'to run Deep Analysis?', required: false })
  @IsOptional()
  @IsBoolean({ message: 'Deep analysis must be a boolean' })
  deepAnalysis?: boolean;
}