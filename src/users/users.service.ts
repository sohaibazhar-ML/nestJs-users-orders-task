import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { OrdersService } from '../orders/orders.service';
import { UserResponseDto } from './user-response.dto';
import { OrderResponseDto } from '../orders/order-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.create({ data: createUserDto });
    return this.toResponseDto(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toResponseDto(user);
  }

  async deleteUser(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.delete({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toResponseDto(user);
  }

  async getUser(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Fetching orders via OrdersService
    const orders = await this.ordersService.getOrdersByUser(id);

    return {
      ...this.toResponseDto(user),
      orders: orders.map(order => new OrderResponseDto(order)),
    };
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => this.toResponseDto(user));
  }

  async getUserWithOrders(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { orders: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      ...this.toResponseDto(user),
      orders: user.orders.map(order => new OrderResponseDto(order)),
    };
  }

  // helper mapper
  private toResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true, // ✅ include password
      },
    });
  }


}
