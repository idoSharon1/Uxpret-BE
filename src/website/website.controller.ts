// src/website/website.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { AnalyzeWebsiteDto } from './dto/analyze-website.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('website') // Groups endpoints under "users"
@Controller('api/website')
// @UseGuards(JwtAuthGuard)
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Post('analyze')
  @ApiBody({ type: AnalyzeWebsiteDto }) // Describes the expected request body
  async analyzeWebsite(
    @Body() analyzeWebsiteDto: AnalyzeWebsiteDto,
    @Request() req,
  ) {
    // Get the user ID from the request (set by JwtAuthGuard)
    const userId = req.user?.userId ?? "67e92091e4ef47c4fb3809ab"; // Replace with actual user ID extraction logic
    return this.websiteService.analyze(analyzeWebsiteDto, userId);
  }
}
