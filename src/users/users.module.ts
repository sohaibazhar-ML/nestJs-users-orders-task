import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports:[OrdersModule],
  providers: [UsersService,PrismaService],
  controllers: [UsersController]
})
export class UsersModule {}
