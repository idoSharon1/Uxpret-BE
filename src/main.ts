import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import * as dotenv from 'dotenv';

async function bootstrap() {
  // Load environment variables
  dotenv.config();

  const app = await NestFactory.create(AppModule);

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
