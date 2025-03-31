import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportHistoryParamDto, ReportParamDto } from './dto/report-param.dto';
import { ReportHistoryQueryDto } from './dto/report-history-query.dto';
import { ReportCompareQueryDto } from './dto/report-compare-query.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('reports') // Groups endpoints under "users"
@Controller('api/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':id')
  @ApiQuery({ name: 'id', required: true, description: 'Get report by id' })
  async getReport(@Param() params: ReportParamDto, @Request() req) {
    const userId = req.user.userId;
    return this.reportsService.getReportById(params.id, userId);
  }

  @Get('/history/:websiteName')
  @ApiQuery({ name: 'websiteName', required: true, description: 'Get all the reposts history of this website that the user did' })
  async getReportHistoryByName(@Param() params: ReportHistoryParamDto, @Request() req) {
    const userId = req.user?.userId ?? "67e92091e4ef47c4fb3809ab"; // Replace with actual user ID extraction logic
    return this.reportsService.getReportHistoryByName(params.websiteName, userId);
  }


  @Delete(':id')
  @ApiQuery({ name: 'id', required: true, description: 'Delete report by id' })
  async deleteReport(@Param() params: ReportParamDto, @Request() req) {
    const userId = req.user.userId;
    await this.reportsService.deleteReport(params.id, userId);
    return { message: 'Report deleted successfully' };
  }

  @Get()
  async getHistory(@Query() query: ReportHistoryQueryDto, @Request() req) {
    const userId = req.user.userId;
    return this.reportsService.getHistory(userId, query);
  }

  @Get('compare/:report1/:report2')
  @ApiQuery({ name: 'report1', required: true, description: 'First report ID to compare' })
  @ApiQuery({ name: 'report2', required: true, description: 'Second report ID to compare' })
  async compareReports(@Query() query: ReportCompareQueryDto, @Request() req) {
    const userId = req.user.userId;
    return this.reportsService.compareReports(
      query.report1,
      query.report2,
      userId,
    );
  }
}
