import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should call authService.register with correct params and return result', async () => {
      const mockResult = { id: 1, email: 'new@test.com', name: 'John' };
      (authService.register as jest.Mock).mockResolvedValue(mockResult);

      const body = { email: 'new@test.com', password: '123456', name: 'John' };
      const result = await controller.register(body);

      expect(authService.register).toHaveBeenCalledWith(
        body.email,
        body.password,
        body.name,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct body and return token', async () => {
      const mockToken = { access_token: 'jwt-token' };
      (authService.login as jest.Mock).mockResolvedValue(mockToken);

      const body = { email: 'test@test.com', password: '123456' };
      const result = await controller.login(body);

      expect(authService.login).toHaveBeenCalledWith(body);
      expect(result).toEqual(mockToken);
    });
  });
});
