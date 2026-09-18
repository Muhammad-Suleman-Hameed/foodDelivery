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
import { User } from '../../users/entities/user.entity';

@Entity('restaurants')
export class Restaurant {
  @ApiProperty({ example: 1, description: 'Unique restaurant ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Burger Crave', description: 'Restaurant name' })
  @Column({ length: 150 })
  name: string;

  @ApiProperty({ example: 'Artisan smashed burgers, loaded crispy fries, and thick shakes.', required: false })
  @Column({ nullable: true, type: 'text' })
  description: string;

  @ApiProperty({ example: 'Burgers • Fast Food • American', description: 'Cuisine tags' })
  @Column({ default: 'Fast Food', length: 120 })
  cuisine: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600', required: false })
  @Column({ nullable: true, type: 'text' })
  imageUrl: string;

  @ApiProperty({ example: '45 Food Plaza, Main Boulevard', description: 'Restaurant location' })
  @Column({ length: 255 })
  address: string;

  @ApiProperty({ example: 4.7, default: 4.5 })
  @Column({ type: 'decimal', precision: 2, scale: 1, default: 4.5 })
  rating: number;

  @ApiProperty({ example: 150, default: 25 })
  @Column({ default: 25 })
  ratingCount: number;

  @ApiProperty({ example: '20-30 min', default: '25-35 min' })
  @Column({ default: '25-35 min', length: 50 })
  deliveryTime: string;

  @ApiProperty({ example: 1.99, default: 1.49 })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.49 })
  deliveryFee: number;

  @ApiProperty({ example: '20% OFF Deals', required: false })
  @Column({ nullable: true, length: 100 })
  dealBadge: string;

  @ApiProperty({ example: 1, description: 'ID of the Restaurant Owner' })
  @Column()
  ownerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ApiProperty({ example: '2026-09-18T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-09-18T12:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
