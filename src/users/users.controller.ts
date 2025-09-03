import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe, UseGuards,ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserAuthGuard } from '../guards/user-auth.guard'; // adjust path

@UseGuards(UserAuthGuard)  // ✅ applies to ALL routes
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  getUser(@Param('id',ParseIntPipe) id: string) {
    return this.usersService.getUser(id);
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateUser(@Param('id',ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get(':id/with-orders')
  getUserWithOrders(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.getUserWithOrders(id);
  }
}
