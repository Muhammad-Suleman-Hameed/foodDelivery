import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Burger Crave', description: 'Restaurant name' })
  @IsString()
  @IsNotEmpty({ message: 'Restaurant name is required' })
  name: string;

  @ApiProperty({ example: 'Artisan smashed burgers, loaded crispy fries, and thick shakes.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Fast Food', default: 'Fast Food' })
  @IsString()
  @IsOptional()
  cuisine?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: '45 Food Plaza, Main Boulevard' })
  @IsString()
  @IsNotEmpty({ message: 'Restaurant address is required' })
  address: string;

  @ApiProperty({ example: '20-30 min', required: false, default: '25-35 min' })
  @IsString()
  @IsOptional()
  deliveryTime?: string;

  @ApiProperty({ example: 1.49, required: false, default: 1.49 })
  @IsNumber()
  @IsOptional()
  deliveryFee?: number;

  @ApiProperty({ example: '20% OFF Deals', required: false })
  @IsString()
  @IsOptional()
  dealBadge?: string;
}
