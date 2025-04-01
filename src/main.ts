import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // Load environment variables
  dotenv.config();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow requests from the frontend
    credentials: true, // Allow cookies to be sent
  });

  const config = new DocumentBuilder()
    .setTitle('UXpert API')
    .setDescription('API for the UXpert frontend')
    .setVersion('1.0')
    .addBearerAuth() // Adds JWT authentication (optional)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger will be available at /api

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes fields not defined in DTO
      forbidNonWhitelisted: true, // Throws error if unknown fields are sent
      transform: true, // Automatically transforms to the correct type
    }),
  );

  // Enable cookie parser
  app.use(cookieParser());
  // Enable CORS for frontend integration
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
