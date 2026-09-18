import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MealCategory } from '../entities/meal.entity';

export class CreateMealDto {
  @ApiProperty({ example: 'Classic Double Cheeseburger', description: 'Meal name' })
  @IsString()
  @IsNotEmpty({ message: 'Meal name is required' })
  name: string;

  @ApiProperty({
    example: 'Two flame-grilled beef patties, double American cheese, pickles, and sauce.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 8.99, description: 'Price in dollars' })
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0.1, { message: 'Price must be greater than 0' })
  price: number;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    enum: MealCategory,
    default: MealCategory.FAST_FOOD,
    description: 'Category: Fast Food, Drinks, Deals, Dessert',
  })
  @IsEnum(MealCategory, { message: 'Category must be Fast Food, Drinks, Deals, or Dessert' })
  @IsOptional()
  category?: MealCategory;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
