import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    createUser: jest.fn(dto => ({ id: '1', ...dto })),
    getUser: jest.fn(id => ({ id, name: 'John Doe' })),
    getAllUsers: jest.fn(() => [{ id: '1', name: 'John Doe' }]),
    updateUser: jest.fn((id, dto) => ({ id, ...dto })),
    deleteUser: jest.fn(id => ({ message: `User ${id} deleted` })),
    getUserWithOrders: jest.fn(id => ({ id, name: 'John Doe', orders: [] })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com' };
      expect(await usersController.createUser(dto)).toEqual({
        id: '1',
        ...dto,
      });
      expect(usersService.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      expect(await usersController.getUser('1')).toEqual({
        id: '1',
        name: 'John Doe',
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      expect(await usersController.getAllUsers()).toEqual([
        { id: '1', name: 'John Doe' },
      ]);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const dto = { name: 'Jane Doe' };
      expect(await usersController.updateUser('1', dto)).toEqual({
        id: '1',
        ...dto,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      expect(await usersController.deleteUser('1')).toEqual({
        message: `User 1 deleted`,
      });
    });
  });

  describe('getUserWithOrders', () => {
    it('should return a user with orders', async () => {
      expect(await usersController.getUserWithOrders('1')).toEqual({
        id: '1',
        name: 'John Doe',
        orders: [],
      });
    });
  });
});
