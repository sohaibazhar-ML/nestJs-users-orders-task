import { Module,forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module'


@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [OrdersService,PrismaService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
