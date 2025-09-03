import { IsNotEmpty,IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  product: string;
}

export class UpdateOrderDto {
  product: string;
}