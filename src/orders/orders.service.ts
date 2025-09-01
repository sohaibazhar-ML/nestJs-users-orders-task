import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async createOrder(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({ data: createOrderDto });
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // Prevent changing userId
    if ('userId' in updateOrderDto && updateOrderDto.userId !== order.userId) {
      throw new BadRequestException('User ID cannot be changed');
    }

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto
    });
  }

  async deleteOrder(id: number) {
    const order = await this.prisma.order.delete({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async getOrder(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async getAllOrders() {
    return this.prisma.order.findMany();
  }

  async getOrdersByUser(orderId: number) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId }, // order id as primary key
        include: {
          user: true, // include related user details
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      return order;
    } catch (error) {
      // You can log error here for debugging
      console.error(error);
      throw new InternalServerErrorException('Something went wrong while fetching the order');
    }
  }
}

