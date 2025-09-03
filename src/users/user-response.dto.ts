import { ApiProperty } from '@nestjs/swagger';
import { OrderResponseDto } from '../orders/order-response.dto';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => [OrderResponseDto], required: false })
  orders?: OrderResponseDto[];
}