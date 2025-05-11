// src/reports/reports.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OverallEvaluation, Report, ReportDocument, WebsiteEvaluation } from './schemas/report.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  async getReportById(id: string, userId: string): Promise<Report> {
    const report = await this.reportModel.findOne({ _id: id, userId }).exec();

    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }

    return report;
  }

  async getReportHistoryByName(websiteName: string, userId: string): Promise<Report[]> {
    console.log(`Fetching report history for website: ${websiteName}, userId: ${userId}`);
    
    const report = await this.reportModel.find({ name: websiteName, userId }).sort({ createdAt: -1 }).exec();

    if (!report) {
      throw new NotFoundException(`Report with the name "${websiteName}" not found`);
    }

    return report;
  }

  async getReportHistoryByProjectId(projectId: string): Promise<Report[]> {
    console.log(`Fetching report history for website: ${projectId}`);
    
    const report = await this.reportModel.find({ projectId }).sort({ createdAt: -1 }).exec();

    if (!report) {
      throw new NotFoundException(`Report with the name "${projectId}" not found`);
    }

    return report;
  }

  async deleteReport(id: string, userId: string): Promise<void> {
    const report = await this.reportModel.findOne({ _id: id, userId }).exec();

    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }

    await this.reportModel.deleteOne({ _id: id }).exec();
  }

  async getHistory(
    userId: string,
    query: any,
  ): Promise<{ reports: Report[]; total: number }> {
    const { page = 1, limit = 10, from, to, sort = 'desc' } = query;

    // Create a filter by dates if provided
    const dateFilter: any = {};
    if (from) {
      dateFilter.createdAt = { $gte: new Date(from) };
    }
    if (to) {
      dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(to) };
    }

    // Complete filter construction
    const filter = {
      userId,
      ...dateFilter,
    };

    // Find the total number of reports that match the filter
    const total = await this.reportModel.countDocuments(filter).exec();

    // Finding reports with browsing and sorting
    const reports = await this.reportModel
      .find(filter)
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      reports,
      total,
    };
  }

  async compareReports(
    reportId1: string,
    reportId2: string,
    userId: string,
  ): Promise<any> {
    // Verify that the user has access to both reports
    const [report1, report2] = await Promise.all([
      this.reportModel.findOne({ _id: reportId1, userId }).exec(),
      this.reportModel.findOne({ _id: reportId2, userId }).exec(),
    ]);

    if (!report1) {
      throw new NotFoundException(`Report with ID "${reportId1}" not found`);
    }

    if (!report2) {
      throw new NotFoundException(`Report with ID "${reportId2}" not found`);
    }

    this.compareCategory(report1.results.category_ratings , report2.results.category_ratings)

    return {
      report1: {
        id: report1._id,
        url: report1.url,
        name: report1.name,
        results: report1.results,
      },
      report2: {
        id: report2._id,
        url: report2.url,
        name: report2.name,
        results: report2.results,
      },
      comparisons: this.compareCategory(report1.results.category_ratings , report2.results.category_ratings),
    };
  }

  private compareScores(score1: number, score2: number): any {
    if (!score1 || !score2) {
      return { comparable: false };
    }

    const difference = score1 - score2;

    return {
      comparable: true,
      difference,
      percentageDifference: ((difference / score2) * 100).toFixed(1) + '%',
      better: difference > 0 ? 'report1' : difference < 0 ? 'report2' : 'equal',
    };
  }

  private compareCategory(report1Categories: WebsiteEvaluation[], report2Categories: WebsiteEvaluation[]): any {
    if (!report1Categories || !report1Categories) {
      return { comparable: false };
    }

    let results: {category: string, numeric_rating:number}[] = [];

    for (const cat1 in report1Categories) {
      for (const cat2 in report2Categories) {
        if (cat1["category"] == cat2["category"]) {
          results[cat1["category"]] = {
            category: cat1["category"],
            numeric_rating: cat2["numeric_rating"] - cat1["numeric_rating"],
          };
        }
      }
    }
    
    return results
  }
}
