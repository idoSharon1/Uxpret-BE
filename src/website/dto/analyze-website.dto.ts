import {
  IsUrl,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class AnalyzeWebsiteDto {
  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsUrl({}, { message: 'Invalid URL format' })
  readonly url: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  readonly name?: string;

  @IsOptional()
  @IsBoolean({ message: 'Include screenshots must be a boolean' })
  readonly includeScreenshots?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Deep analysis must be a boolean' })
  readonly deepAnalysis?: boolean;
}
