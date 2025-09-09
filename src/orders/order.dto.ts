import { IsNotEmpty,IsString,IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  product: string;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  product?: string;
}