import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ReportCompareQueryDto {
  @IsNotEmpty({ message: 'Report1 ID cannot be empty' })
  @IsString({ message: 'Report1 ID must be a string' })
  @Matches(/^[a-f\d]{24}$/i, { message: 'Invalid report1 ID format' })
  readonly report1: string;

  @IsNotEmpty({ message: 'Report2 ID cannot be empty' })
  @IsString({ message: 'Report2 ID must be a string' })
  @Matches(/^[a-f\d]{24}$/i, { message: 'Invalid report2 ID format' })
  readonly report2: string;
}
