import { Module,forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports:[forwardRef(() =>OrdersModule)],
  providers: [UsersService,PrismaService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
