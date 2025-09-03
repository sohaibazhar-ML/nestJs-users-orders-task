import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product: string;

  @ApiProperty()
  quantity: number;

  constructor(partial: Partial<OrderResponseDto>) {
    Object.assign(this, partial);
  }
}
