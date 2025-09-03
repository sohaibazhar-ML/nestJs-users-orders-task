import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../users/user-response.dto';

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: () => UserResponseDto, required: false })
  user?: UserResponseDto;
}