import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

export enum MealCategory {
  FAST_FOOD = 'Fast Food',
  DRINKS = 'Drinks',
  DEALS = 'Deals',
  DESSERT = 'Dessert',
}

@Entity('meals')
export class Meal {
  @ApiProperty({ example: 1, description: 'Unique meal ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Classic Double Cheeseburger', description: 'Meal name' })
  @Column({ length: 150 })
  name: string;

  @ApiProperty({
    example: 'Two flame-grilled beef patties, double American cheese, pickles, lettuce, and secret house mayo.',
    required: false,
  })
  @Column({ nullable: true, type: 'text' })
  description: string;

  @ApiProperty({ example: 8.99, description: 'Price in dollars' })
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  price: number;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', required: false })
  @Column({ nullable: true, type: 'text' })
  imageUrl: string;

  @ApiProperty({
    enum: MealCategory,
    default: MealCategory.FAST_FOOD,
    description: 'Menu section category',
  })
  @Column({
    type: 'varchar',
    length: 50,
    default: MealCategory.FAST_FOOD,
  })
  category: MealCategory;

  @ApiProperty({ example: true, default: true, description: 'Whether meal is currently available in kitchen' })
  @Column({ default: true })
  isAvailable: boolean;

  @ApiProperty({ example: 1, description: 'Restaurant ID' })
  @Column()
  restaurantId: number;

  @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @ApiProperty({ example: '2026-09-18T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-09-18T12:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
