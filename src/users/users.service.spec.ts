import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { NotFoundException } from '@nestjs/common';
import { UserResponseDto } from './user-response.dto';
import { OrderResponseDto } from '../orders/order-response.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: jest.Mocked<PrismaService>;
  let ordersServiceMock: jest.Mocked<OrdersService>;

  const mockUser = { id: '1', email: 'john@example.com', name: 'John Doe' };
  const mockOrder = { id: 'order-1', product: 'Laptop' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: OrdersService,
          useValue: {
            getOrdersByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaMock = module.get(PrismaService);
    ordersServiceMock = module.get(OrdersService);
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await service.createUser({
        email: 'john@example.com',
        name: 'John Doe',
      });

      expect(result).toEqual<UserResponseDto>({
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
      });
      expect(prismaMock.user.create).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      prismaMock.user.update.mockResolvedValue(mockUser);

      const result = await service.updateUser('1', { name: 'John Doe' });

      expect(result).toEqual<UserResponseDto>({
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      prismaMock.user.update.mockResolvedValue(null as any);

      await expect(
        service.updateUser('999', { name: 'Ghost' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete and return a user', async () => {
      prismaMock.user.delete.mockResolvedValue(mockUser);

      const result = await service.deleteUser('1');

      expect(result).toEqual<UserResponseDto>({
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      prismaMock.user.delete.mockResolvedValue(null as any);

      await expect(service.deleteUser('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUser', () => {
    it('should return user with orders', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      ordersServiceMock.getOrdersByUser.mockResolvedValue([
        new OrderResponseDto(mockOrder),
      ]);

      const result = await service.getUser('1');

      expect(result).toHaveProperty('orders');
      expect(result.orders[0]).toBeInstanceOf(OrderResponseDto);
    });

    it('should throw NotFoundException if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null as any);

      await expect(service.getUser('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.getAllUsers();

      expect(result).toEqual([
        { id: '1', email: 'john@example.com', name: 'John Doe' },
      ]);
    });
  });

  describe('getUserWithOrders', () => {
    it('should return user with orders', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        orders: [mockOrder],
      });

      const result = await service.getUserWithOrders('1');

      expect(result.orders[0]).toBeInstanceOf(OrderResponseDto);
    });

    it('should throw NotFoundException if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null as any);

      await expect(
        service.getUserWithOrders('999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user with password', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
        password: 'hashedpassword',
      });

      const result = await service.findByEmail('john@example.com');

      expect(result).toHaveProperty('password');
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
        },
      });
    });
  });
});
