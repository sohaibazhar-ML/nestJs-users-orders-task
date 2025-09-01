import { IsNotEmpty,IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsString()
  product: string;
}

export class UpdateOrderDto {
  userId: number;
  product: string;
}