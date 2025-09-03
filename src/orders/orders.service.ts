import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

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
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
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
      if (!orders || orders.length === 0) {
        throw new NotFoundException(`Orders with User ID ${userId} not found`);
      }
      return orders;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong while fetching the orders');
    }
  }
}