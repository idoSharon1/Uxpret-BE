import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ReportParamDto {
  @IsNotEmpty({ message: 'Report ID cannot be empty' })
  @IsString({ message: 'Report ID must be a string' })
  @Matches(/^[a-f\d]{24}$/i, { message: 'Invalid report ID format' })
  readonly id: string;
}
