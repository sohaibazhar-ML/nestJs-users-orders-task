import { Module, forwardRef, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaService } from './prisma/prisma.service';
import { MiddlewareConsumer } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/logging.middleware'
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true, // makes .env available everywhere
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => OrdersModule),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, LoggingMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // Apply logging middleware to all routes
  }
}