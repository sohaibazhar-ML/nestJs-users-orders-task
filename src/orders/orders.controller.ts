import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe,ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get(':id')
  getOrder(@Param('id',ParseIntPipe) id: number) {
    return this.ordersService.getOrder(id);
  }

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateOrder(@Param('id',ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  deleteOrder(@Param('id',ParseIntPipe) id: number) {
    return this.ordersService.deleteOrder(id);
  }

  @Get('user/:userId')
  getOrdersByUser(@Param('userId',ParseIntPipe) userId: number) {
    return this.ordersService.getOrdersByUser(userId);
  }
}