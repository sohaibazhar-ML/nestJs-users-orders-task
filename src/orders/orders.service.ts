import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { UsersService } from '../users/users.service';
import { OrderResponseDto } from './order-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = await this.prisma.order.create({ data: createOrderDto });
    return new OrderResponseDto(order);
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Prevent changing userId
    if ('userId' in updateOrderDto && updateOrderDto.userId !== order.userId) {
      throw new BadRequestException('User ID cannot be changed');
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });

    return new OrderResponseDto(updated);
  }

  async deleteOrder(id: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.delete({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return new OrderResponseDto(order);
  }

  async getOrder(id: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const userWithOrders = await this.usersService.getUserWithOrders(order.userId);

    const userOrder = userWithOrders.orders?.find((o) => o.id === id);

    if (!userOrder) {
      throw new NotFoundException(
        `Order with ID ${id} not found for user ${order.userId}`,
      );
    }

    return new OrderResponseDto(userOrder);
  }

  async getAllOrders(): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany();
    return orders.map((order) => new OrderResponseDto(order));
  }

  async getOrdersByUser(userId: string): Promise<OrderResponseDto[]> {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: {
          user: true,
        },
      });

      return orders.map((order) => new OrderResponseDto(order));
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
