import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ example: 1, description: 'ID of the meal to add' })
  @IsInt()
  @IsNotEmpty()
  mealId: number;

  @ApiProperty({ example: 1, default: 1, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
