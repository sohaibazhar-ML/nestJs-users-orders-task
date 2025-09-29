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

  const mockUser = { id: '1', email: 'john@example.com', name: 'John Doe', password: 'secret123' };
  const mockOrder = { id: 'order-1', product: 'Laptop' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn() as jest.Mock,
              update: jest.fn() as jest.Mock,
              delete: jest.fn() as jest.Mock,
              findUnique: jest.fn() as jest.Mock,
              findMany: jest.fn() as jest.Mock,
            },
          },
        },
        {
          provide: OrdersService,
          useValue: {
            getOrdersByUser: jest.fn() as jest.Mock,
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
      (prismaMock.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.createUser({
        email: 'john@example.com',
        name: 'John Doe',
        password: 'secret123', // ✅ required field
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
      (prismaMock.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.updateUser('1', { name: 'John Doe' });

      expect(result).toEqual<UserResponseDto>({
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      (prismaMock.user.update as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateUser('999', { name: 'Ghost' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete and return a user', async () => {
      (prismaMock.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.deleteUser('1');

      expect(result).toEqual<UserResponseDto>({
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      (prismaMock.user.delete as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteUser('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (ordersServiceMock.getOrdersByUser as jest.Mock).mockResolvedValue([
        new OrderResponseDto(mockOrder),
      ]);

      const result = await service.getUser('1');

      expect(result).toHaveProperty('orders');
      expect(result.orders![0]).toBeInstanceOf(OrderResponseDto); // ✅ use !
    });

    it('should throw NotFoundException if user not found', async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getUser('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      (prismaMock.user.findMany as jest.Mock).mockResolvedValue([mockUser]);

      const result = await service.getAllUsers();

      expect(result).toEqual([
        { id: '1', email: 'john@example.com', name: 'John Doe' },
      ]);
    });
  });

  describe('getUserWithOrders', () => {
    it('should return user with orders', async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        orders: [mockOrder],
      });

      const result = await service.getUserWithOrders('1');

      expect(result.orders![0]).toBeInstanceOf(OrderResponseDto); // ✅ use !
    });

    it('should throw NotFoundException if user not found', async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.getUserWithOrders('999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

});
