import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'; // ✅ fixed import
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

dotenv.config();

const server = express();

async function createApp() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const config = new DocumentBuilder()
    .setTitle('UXpert API')
    .setDescription('API for the UXpert frontend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://uxpert.vercel.app',
      'http://localhost:5173',
    ],
    credentials: true,
  });

  await app.init();
  return server;
}

export default createApp();

if (!process.env.VERCEL) {
  createApp().then((app) =>
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Application is running on: http://localhost:${process.env.PORT || 3001}`,
      );
    }),
  );
}
