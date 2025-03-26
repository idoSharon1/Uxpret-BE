// src/website/website.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { AnalyzeWebsiteDto } from './dto/analyze-website.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/website')
@UseGuards(JwtAuthGuard)
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Post('analyze')
  async analyzeWebsite(
    @Body() analyzeWebsiteDto: AnalyzeWebsiteDto,
    @Request() req,
  ) {
    // Get the user ID from the request (set by JwtAuthGuard)
    const userId = req.user.userId;
    return this.websiteService.analyze(analyzeWebsiteDto, userId);
  }
}
