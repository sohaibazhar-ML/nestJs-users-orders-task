import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// ✅ Mock bcrypt globally
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('mocked_jwt_token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashed' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // ✅ use mocked function

      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
    });

    it('should throw if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        service.validateUser('test@test.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password does not match', async () => {
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashed' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // ✅ use mocked function

      await expect(
        service.validateUser('test@test.com', 'wrongpass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const result = await service.login({ id: 1, email: 'test@test.com' });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@test.com',
      });
      expect(result).toEqual({ access_token: 'mocked_jwt_token' });
    });
  });

  describe('register', () => {
    it('should hash password and call createUser', async () => {
      const mockCreatedUser = { id: 1, email: 'new@test.com' };
      (usersService.createUser as jest.Mock).mockResolvedValue(mockCreatedUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword'); // ✅ use mocked function

      const result = await service.register('new@test.com', 'password', 'John');

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(usersService.createUser).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'hashedPassword',
        name: 'John',
      });
      expect(result).toEqual(mockCreatedUser);
    });
  });
});
