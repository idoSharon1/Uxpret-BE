import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ReportParamDto {
  @IsNotEmpty({ message: 'Report ID cannot be empty' })
  @IsString({ message: 'Report ID must be a string' })
  @Matches(/^[a-f\d]{24}$/i, { message: 'Invalid report ID format' })
  readonly id: string;
}

export class ReportHistoryParamDto {
  @IsNotEmpty({ message: 'Website Name cannot be empty' })
  @IsString({ message: 'Website Name must be a string' })
  @Matches(/^[a-zA-Z0-9\s]+$/, { message: 'Invalid Website Name format' })
  readonly websiteName: string;
}

export class ReportHistoryByProjectIdParamDto {
  @IsNotEmpty({ message: 'Website Name cannot be empty' })
  @IsString({ message: 'Website Name must be a string' })
  readonly projectId: string;
}
