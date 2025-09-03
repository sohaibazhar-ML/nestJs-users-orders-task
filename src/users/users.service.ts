import { Injectable, NotFoundException,Inject,forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { OrdersService } from '../orders/orders.service';       //imported Orders Service


@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.delete({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    //Fetching orders via OrdersService
    const orders = await this.ordersService.getOrdersByUser(id);

    return {
      ...user,
      orders,
    };
  }


  async getAllUsers() {
    return this.prisma.user.findMany();
  }


  async getUserWithOrders(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { orders: true }, // fetch related orders
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}