import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }

  async createOrder(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({ data: createOrderDto });
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    // Prevent changing userId
    if ('userId' in updateOrderDto && updateOrderDto.userId !== order.userId) {
      throw new BadRequestException('User ID cannot be changed');
    }
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  async deleteOrder(id: string) {
    const order = await this.prisma.order.delete({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async getOrder(id: string) {

    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const userWithOrders = await this.usersService.getUserWithOrders(order.userId);

    const userOrder = userWithOrders.orders.find((o) => o.id === id);

    if (!userOrder) {
      throw new NotFoundException(
        `Order with ID ${id} not found for user ${order.userId}`,
      );
    }

    return {
      ...userOrder,
      user: {
        id: userWithOrders.id,
        name: userWithOrders.name,
        email: userWithOrders.email,
      },
    };
  }


  async getAllOrders() {
    return this.prisma.order.findMany();
  }

  async getOrdersByUser(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: {
          user: true,
        },
      });

      return orders;
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Something went wrong while fetching the orders',
      );
    }
  }

}