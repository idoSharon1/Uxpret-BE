import { ApiProperty } from '@nestjs/swagger';
import {
  IsUrl,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class AnalyzeWebsiteDto {

  @ApiProperty({ example: 'https://www.colman.ac.il/', description: 'Website Url' })
  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsUrl({}, { message: 'Invalid URL format' })
  readonly url: string;

  @ApiProperty({ example: 'College of Management', description: 'Website name' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  readonly name?: string;

  @ApiProperty({ example: 'false', description: 'to include screenshot?' })
  @IsOptional()
  @IsBoolean({ message: 'Include screenshots must be a boolean' })
  readonly includeScreenshots?: boolean;

  @ApiProperty({ example: 'false', description: 'to run Deep Analysis?' })
  @IsOptional()
  @IsBoolean({ message: 'Deep analysis must be a boolean' })
  readonly deepAnalysis?: boolean;
}
