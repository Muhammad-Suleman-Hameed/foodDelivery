import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BlockUserDto {
  @ApiProperty({ example: 2, description: 'ID of the Regular User to block' })
  @IsNumber()
  @IsNotEmpty({ message: 'Target userId is required' })
  userId: number;

  @ApiProperty({ example: 'Abusive delivery behavior', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
