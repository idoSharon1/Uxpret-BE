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
import { ReportParamDto } from './dto/report-param.dto';
import { ReportHistoryQueryDto } from './dto/report-history-query.dto';
import { ReportCompareQueryDto } from './dto/report-compare-query.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reports') // Groups endpoints under "users"
@Controller('api/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':id')
  async getReport(@Param() params: ReportParamDto, @Request() req) {
    const userId = req.user.userId;
    return this.reportsService.getReportById(params.id, userId);
  }

  @Delete(':id')
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

  @Get('compare')
  async compareReports(@Query() query: ReportCompareQueryDto, @Request() req) {
    const userId = req.user.userId;
    return this.reportsService.compareReports(
      query.report1,
      query.report2,
      userId,
    );
  }
}
