import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { OrderResponseDto } from './order-response.dto';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress error logs
});

afterAll(() => {
  jest.restoreAllMocks(); // Restore original console.error
});

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: jest.Mocked<PrismaService>;
  let usersService: jest.Mocked<UsersService>;

  const mockOrder = { id: 'order-1', userId: 'user-1', product: 'Laptop' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserWithOrders: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get(PrismaService);
    usersService = module.get(UsersService);
  });

  describe('createOrder', () => {
    it('should create and return an order', async () => {
      prisma.order.create.mockResolvedValue(mockOrder);

      const result = await service.createOrder({ product: 'Laptop' } as any);

      expect(prisma.order.create).toHaveBeenCalledWith({ data: { product: 'Laptop' } });
      expect(result).toEqual(new OrderResponseDto(mockOrder));
    });
  });

  describe('updateOrder', () => {
    it('should update an order', async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrder);
      prisma.order.update.mockResolvedValue({ ...mockOrder, product: 'Phone' });

      const result = await service.updateOrder('order-1', { product: 'Phone' } as any);

      expect(prisma.order.findUnique).toHaveBeenCalledWith({ where: { id: 'order-1' } });
      expect(prisma.order.update).toHaveBeenCalledWith({ where: { id: 'order-1' }, data: { product: 'Phone' } });
      expect(result).toEqual(new OrderResponseDto({ ...mockOrder, product: 'Phone' }));
    });

    it('should throw NotFoundException if order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(service.updateOrder('missing-id', { product: 'Phone' } as any))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw BadRequestException if userId is changed', async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrder);

      await expect(service.updateOrder('order-1', { userId: 'other-user' } as any))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('deleteOrder', () => {
    it('should delete and return an order', async () => {
      prisma.order.delete.mockResolvedValue(mockOrder);

      const result = await service.deleteOrder('order-1');

      expect(prisma.order.delete).toHaveBeenCalledWith({ where: { id: 'order-1' } });
      expect(result).toEqual(new OrderResponseDto(mockOrder));
    });

    it('should throw NotFoundException if order not found', async () => {
      prisma.order.delete.mockResolvedValue(null);

      await expect(service.deleteOrder('missing-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrder', () => {
    it('should return an order if found for the user', async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrder);
      usersService.getUserWithOrders.mockResolvedValue({
        id: 'user-1',
        orders: [mockOrder],
      });

      const result = await service.getOrder('order-1');

      expect(prisma.order.findUnique).toHaveBeenCalledWith({ where: { id: 'order-1' } });
      expect(usersService.getUserWithOrders).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(new OrderResponseDto(mockOrder));
    });

    it('should throw NotFoundException if order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(service.getOrder('missing-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if order not found in user orders', async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrder);
      usersService.getUserWithOrders.mockResolvedValue({
        id: 'user-1',
        orders: [],
      });

      await expect(service.getOrder('order-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      prisma.order.findMany.mockResolvedValue([mockOrder]);

      const result = await service.getAllOrders();

      expect(prisma.order.findMany).toHaveBeenCalled();
      expect(result).toEqual([new OrderResponseDto(mockOrder)]);
    });
  });

  describe('getOrdersByUser', () => {
    it('should return orders for a user', async () => {
      prisma.order.findMany.mockResolvedValue([mockOrder]);

      const result = await service.getOrdersByUser('user-1');

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: { user: true },
      });
      expect(result).toEqual([new OrderResponseDto(mockOrder)]);
    });

    it('should throw InternalServerErrorException if something goes wrong', async () => {
      prisma.order.findMany.mockRejectedValue(new Error('DB error'));

      await expect(service.getOrdersByUser('user-1')).rejects.toThrow(InternalServerErrorException);
    });
  });
});
