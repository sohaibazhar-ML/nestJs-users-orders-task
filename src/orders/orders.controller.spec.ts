import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { OrderResponseDto } from './order-response.dto';



describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<OrdersService>;

  const mockOrder: OrderResponseDto = { id: 'order-1', product: 'Laptop' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            createOrder: jest.fn(),
            getOrder: jest.fn(),
            getAllOrders: jest.fn(),
            updateOrder: jest.fn(),
            deleteOrder: jest.fn(),
            getOrdersByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get(OrdersService);
  });

  describe('createOrder', () => {
    it('should call service.createOrder with dto and return result', async () => {
      (service.createOrder as jest.Mock).mockResolvedValue(mockOrder);

      const dto: CreateOrderDto = { product: 'Laptop' } as any;
      const result = await controller.createOrder(dto);

      expect(service.createOrder).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getOrder', () => {
    it('should return order by id', async () => {
      (service.getOrder as jest.Mock).mockResolvedValue(mockOrder);

      const result = await controller.getOrder('order-1');

      expect(service.getOrder).toHaveBeenCalledWith('order-1');
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      (service.getAllOrders as jest.Mock).mockResolvedValue([mockOrder]);

      const result = await controller.getAllOrders();

      expect(service.getAllOrders).toHaveBeenCalled();
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('updateOrder', () => {
    it('should update an order and return result', async () => {
      (service.updateOrder as jest.Mock).mockResolvedValue(mockOrder);

      const dto: UpdateOrderDto = { product: 'Laptop' } as any;
      const result = await controller.updateOrder('order-1', dto);

      expect(service.updateOrder).toHaveBeenCalledWith('order-1', dto);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('deleteOrder', () => {
    it('should call service.deleteOrder and return result', async () => {
      (service.deleteOrder as jest.Mock).mockResolvedValue(mockOrder);

      const result = await controller.deleteOrder('order-1');

      expect(service.deleteOrder).toHaveBeenCalledWith('order-1');
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getOrdersByUser', () => {
    it('should return orders for a given user', async () => {
      (service.getOrdersByUser as jest.Mock).mockResolvedValue([mockOrder]);

      const result = await controller.getOrdersByUser('user-1');

      expect(service.getOrdersByUser).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockOrder]);
    });
  });
});
