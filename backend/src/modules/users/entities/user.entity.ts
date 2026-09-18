import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  REGULAR_USER = 'REGULAR_USER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
}

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'Unique user identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Muhammad Suleman', description: 'Full name of user' })
  @Column({ length: 120 })
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @Column({ unique: true, length: 180 })
  email: string;

  @Column({ select: false })
  password: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.REGULAR_USER,
    description: 'User role: Regular User (Customer) or Restaurant Owner',
  })
  @Column({
    type: 'varchar',
    length: 30,
    default: UserRole.REGULAR_USER,
  })
  role: UserRole;

  @ApiProperty({ example: false, description: 'Indicates if user account is blocked' })
  @Column({ default: false })
  isBlocked: boolean;

  @ApiProperty({ example: '+923001234567', required: false })
  @Column({ nullable: true, length: 30 })
  phone: string;

  @ApiProperty({ example: '123 Food Street, Downtown', required: false })
  @Column({ nullable: true, type: 'text' })
  address: string;

  @ApiProperty({ example: '2026-09-17T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-09-17T12:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
