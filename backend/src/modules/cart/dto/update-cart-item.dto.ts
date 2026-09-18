import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ example: 3, description: 'Updated quantity (0 will remove item)' })
  @IsInt()
  @Min(0)
  quantity: number;
}
