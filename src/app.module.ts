import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => OrdersModule),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
