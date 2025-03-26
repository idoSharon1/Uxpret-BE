// src/website/website.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyzeWebsiteDto } from './dto/analyze-website.dto';
import { Report, ReportDocument } from '../reports/schemas/report.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class WebsiteService {
  private readonly logger = new Logger(WebsiteService.name);

  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private usersService: UsersService,
  ) {}

  async analyze(analyzeWebsiteDto: AnalyzeWebsiteDto, userId: string) {
    try {
      this.logger.log(`Starting analysis for URL: ${analyzeWebsiteDto.url}`);

      // 1. Validate the URL is accessible
      await this.validateUrl(analyzeWebsiteDto.url);

      // 2. Create a new report entry with status "processing"
      const report = new this.reportModel({
        userId,
        url: analyzeWebsiteDto.url,
        name: analyzeWebsiteDto.name || analyzeWebsiteDto.url,
        status: 'processing',
        createdAt: new Date(),
      });

      await report.save();

      // 3. Start the analysis process asynchronously
      this.processWebsiteAnalysis(report.id, analyzeWebsiteDto).catch(
        (error) => {
          this.logger.error(
            `Analysis failed for ${analyzeWebsiteDto.url}`,
            error.stack,
          );
          this.updateReportStatus(report.id, 'failed', {
            error: error.message,
          });
        },
      );

      // 4. Return the report ID immediately so the client can poll for updates
      return {
        reportId: report._id,
        status: 'processing',
        message: 'Analysis has been queued and will be processed shortly',
      };
    } catch (error) {
      this.logger.error(
        `Failed to start analysis for ${analyzeWebsiteDto.url}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to analyze website: ${error.message}`,
      );
    }
  }

  private async validateUrl(url: string): Promise<void> {
    try {
      // Basic check if the URL is accessible
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`URL returned status ${response.status}`);
      }
    } catch (error) {
      throw new Error(`URL validation failed: ${error.message}`);
    }
  }

  private async processWebsiteAnalysis(
    reportId: string,
    options: AnalyzeWebsiteDto,
  ): Promise<void> {
    try {
      // 1. Update status to "analyzing"
      await this.updateReportStatus(reportId, 'analyzing');

      // 2. Fetch the website content
      const content = await this.fetchWebsiteContent(options.url);

      // 3. Take screenshots if requested
      let screenshots: string[] = [];
      if (options.includeScreenshots) {
        screenshots = await this.captureScreenshots(options.url);
      }

      // 4. Perform AI analysis
      // integrate with AI  service
      const analysisResults = await this.performAiAnalysis(
        content,
        options.deepAnalysis,
      );

      // 5. Generate PDF report
      const pdfUrl = await this.generatePdfReport(
        reportId,
        analysisResults,
        screenshots,
      );

      // 6. Update report with results
      await this.updateReportStatus(reportId, 'completed', {
        results: analysisResults,
        pdfUrl,
        completedAt: new Date(),
      });
    } catch (error) {
      // Update report with error status
      await this.updateReportStatus(reportId, 'failed', {
        error: error.message,
      });
      throw error;
    }
  }

  private async updateReportStatus(
    reportId: string,
    status: string,
    additionalData: any = {},
  ): Promise<void> {
    await this.reportModel.findByIdAndUpdate(reportId, {
      status,
      ...additionalData,
      updatedAt: new Date(),
    });
  }

  private async fetchWebsiteContent(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch website content: ${error.message}`);
    }
  }

  private async captureScreenshots(url: string): Promise<string[]> {
    this.logger.log(`Capturing screenshots for ${url}`);
    await Promise.resolve();
    return [
      'https://your-storage-service.com/screenshots/screenshot1.png',
      'https://your-storage-service.com/screenshots/screenshot2.png',
    ];
  }

  private async performAiAnalysis(
    content: string,
    deepAnalysis: boolean = false,
  ): Promise<any> {
    // This is where you would integrate with your AI service
    // For example, OpenAI API or your custom ML model
    this.logger.log(
      `Performing ${deepAnalysis ? 'deep' : 'standard'} AI analysis`,
    );

    // Simulating AI analysis with a delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      seo: {
        score: 85,
        suggestions: ['Add meta descriptions', 'Improve heading structure'],
      },
      accessibility: {
        score: 72,
        suggestions: ['Add alt text to images', 'Improve contrast ratio'],
      },
      performance: {
        score: 90,
        suggestions: ['Optimize image sizes', 'Enable caching'],
      },
      usability: {
        score: 80,
        suggestions: ['Improve mobile navigation', 'Enhance form usability'],
      },
      // Additional data if deep analysis was requested
      ...(deepAnalysis
        ? {
            contentQuality: {
              score: 78,
              suggestions: ['Reduce duplicate content', 'Improve readability'],
            },
            competitiveAnalysis: {
              rank: 'Medium',
              strengths: ['Good performance', 'Clear navigation'],
              weaknesses: ['Limited content', 'Few backlinks'],
            },
          }
        : {}),
    };
  }

  private async generatePdfReport(
    reportId: string,
    analysisResults: any,
    screenshots: string[],
  ): Promise<string> {
    // This would typically use a PDF generation library like PDFKit
    // For simplicity, we're returning a placeholder URL
    this.logger.log(`Generating PDF report for report ${reportId}`);
    await Promise.resolve();
    return `https://your-storage-service.com/reports/${reportId}.pdf`;
  }
}
