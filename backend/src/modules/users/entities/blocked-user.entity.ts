import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('blocked_users')
@Unique(['ownerId', 'userId'])
export class BlockedUser {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID of the Restaurant Owner who placed the block' })
  @Column()
  ownerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ApiProperty({ example: 2, description: 'ID of the Regular User who is blocked' })
  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ example: 'Abusive behavior towards delivery staff', required: false })
  @Column({ nullable: true, type: 'text' })
  reason: string;

  @ApiProperty({ example: '2026-09-18T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}
