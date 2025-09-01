import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({ data: createOrderDto });
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
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

  async getOrdersByUser(userId: number) {
    return this.prisma.order.findMany({ where: { userId } });
  }
}