import { ApiProperty } from '@nestjs/swagger';
import {
  IsUrl,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class AnalyzeWebsiteDto {
  @ApiProperty({
    example: 'https://www.colman.ac.il/',
    description: 'Website Url',
  })
  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsUrl({}, { message: 'Invalid URL format' })
  readonly url: string;

  @ApiProperty({ example: 'www.colman.ac.il', description: 'Website name' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  readonly name: string;

  @ApiProperty({
    example: '["Programming","Social Media"]',
    description: 'Website categories',
  })
  @IsOptional()
  @IsArray({ message: 'categories must be a string array' })
  readonly categories: string[];

  @ApiProperty({
    example: '["Adults","Teens"]',
    description: 'Website audience',
  })
  @IsOptional()
  @IsArray({ message: 'audience must be a string array' })
  readonly audience: string[];

  @ApiProperty({
    example: '["Professional", "Security & Trust"]',
    description: 'Website emotions',
  })
  @IsOptional()
  @IsArray({ message: 'emotions must be a string array' })
  readonly emotions: string[];

  @ApiProperty({
    example: 'Website for academic studies',
    description: 'Website name',
  })
  @IsOptional()
  @IsString({ message: 'purpose must be a string' })
  readonly purpose: string;

  @ApiProperty({ example: 'false', description: 'to include screenshot?' })
  @IsOptional()
  @IsBoolean({ message: 'Include screenshots must be a boolean' })
  readonly includeScreenshots?: boolean;

  @ApiProperty({ example: 'false', description: 'to run Deep Analysis?' })
  @IsOptional()
  @IsBoolean({ message: 'Deep analysis must be a boolean' })
  readonly deepAnalysis?: boolean;
}
