// src/website/website.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyzeWebsiteDto } from './dto/analyze-website.dto';
import { Report, ReportDocument } from '../reports/schemas/report.schema';
import { UsersService } from '../users/users.service';
import { fetchWebsiteContent, validateUrl } from './utils/website';
import { convertApiResponse, getWebsiteGemeniAnalysis } from './utils/Gemini';
import { log } from 'console';

@Injectable()
export class WebsiteService {
  private readonly logger = new Logger(WebsiteService.name);

  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private usersService: UsersService,
  ) {}

  async analyze(analyzeWebsiteDto: AnalyzeWebsiteDto, userId: string, email: string) {
    try {
      this.logger.log(`Starting analysis for URL: ${analyzeWebsiteDto.url}`);

      // 1. Validate the URL is accessible
      await validateUrl(analyzeWebsiteDto.url);

      // 2. Create a new report entry with status "processing"
      const report = new this.reportModel({
        userId,
        email: email,
        url: analyzeWebsiteDto.url,
        name: analyzeWebsiteDto.name,
        categories: analyzeWebsiteDto.categories,
        audience: analyzeWebsiteDto.audience,
        emotions: analyzeWebsiteDto.emotions,
        purpose: analyzeWebsiteDto.purpose,
        status: 'processing',
        createdAt: new Date(),
      });

      await report.save();

      // 3. Start the analysis process asynchronously
      const results = await this.processWebsiteAnalysis(report.id, analyzeWebsiteDto).catch(
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
      // return {
      //   reportId: report._id,
      //   status: 'processing',
      //   message: 'Analysis has been queued and will be processed shortly',
      // };
      return results;
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

  private async processWebsiteAnalysis(
    reportId: string,
    options: AnalyzeWebsiteDto,
  ): Promise<any> {
    try {
      // 1. Update status to "analyzing"
      await this.updateReportStatus(reportId, 'analyzing');

      // 2. Fetch the website content
      const content = (await fetchWebsiteContent(options.url)).toString();

      // TODO
      // // 3. Take screenshots if requested
      // let screenshots: string[] = [];
      // if (options.includeScreenshots) {
      //   screenshots = await this.captureScreenshots(options.url);
      // }

      // 4. Perform AI analysis
      // integrate with AI  service
      const analysisResults = await this.performAiAnalysis(
        content,
        options,
      );
      
      // TDOD
      // // 5. Generate PDF report
      // const pdfUrl = await this.generatePdfReport(
      //   reportId,
      //   analysisResults,
      //   screenshots,
      // );

      // TDOD
      // // 6. Generate HTML file and expose it 

      if (analysisResults == null) {
        throw new BadRequestException('AI analysis failed');
      } else { 
        // 6. Update report with results
        await this.updateReportStatus(reportId, 'completed', {
          results: analysisResults.website_evaluation,
          pdfUrl: "", //pdfUrl,
          completedAt: new Date(),
        });
        return analysisResults.website_evaluation;
      }
    } catch (error) {
      // Update report with error status
      await this.updateReportStatus(reportId, 'failed', {
        error: error.message,
      });
      throw error;
    }
  }

  private async performAiAnalysis(
    content: string,
    options: AnalyzeWebsiteDto,
  ): Promise<any> {

    return getWebsiteGemeniAnalysis(content, options).then((response) => {
      const res = response.candidates[0].content.parts[0].text;
      const evaluation_json = convertApiResponse(res);
      console.log('AI Analysis response:');
      log({evaluation_json: evaluation_json});
      return evaluation_json;
    }).catch((error) => {
      console.error('Error during AI analysis:', error);
      return null
    });
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

  private async captureScreenshots(url: string): Promise<string[]> {
    this.logger.log(`Capturing screenshots for ${url}`);
    await Promise.resolve();
    return [
      'https://your-storage-service.com/screenshots/screenshot1.png',
      'https://your-storage-service.com/screenshots/screenshot2.png',
    ];
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
