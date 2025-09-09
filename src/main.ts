import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from '../prisma/prisma-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Prisma exception filter
  app.useGlobalFilters(new PrismaExceptionFilter());

  // ✅ Global validation pipe (fixes your issue)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips out unknown properties
      forbidNonWhitelisted: true, // throws error if extra fields are sent
      transform: true, // transforms payloads to DTO instances
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('User Orders API')
    .setDescription('API documentation for users and orders')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
