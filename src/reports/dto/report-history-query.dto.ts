import { IsOptional, IsInt, Min, Max, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportHistoryQueryDto {
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @Type(() => Number)
  readonly page?: number = 1;

  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  @Type(() => Number)
  readonly limit?: number = 10;

  @IsOptional()
  @IsDate({ message: 'From date must be a valid date' })
  @Type(() => Date)
  readonly from?: Date;

  @IsOptional()
  @IsDate({ message: 'To date must be a valid date' })
  @Type(() => Date)
  readonly to?: Date;

  @IsOptional()
  @IsString({ message: 'Sort must be a string' })
  readonly sort?: 'asc' | 'desc' = 'desc';
}
