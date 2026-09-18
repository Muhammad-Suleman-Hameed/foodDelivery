import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { BlockedUser } from './entities/blocked-user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findById(id);
  }

  // Restaurant Owner User Blocking Logic
  async blockUser(ownerId: number, userId: number, reason?: string): Promise<BlockedUser> {
    if (ownerId === userId) {
      throw new BadRequestException('You cannot block yourself');
    }

    const targetUser = await this.findById(userId);
    if (targetUser.role === UserRole.RESTAURANT_OWNER) {
      throw new BadRequestException('You cannot block another Restaurant Owner');
    }

    const existingBlock = await this.blockedUserRepository.findOne({
      where: { ownerId, userId },
    });
    if (existingBlock) {
      throw new ConflictException('User is already blocked');
    }

    const block = this.blockedUserRepository.create({
      ownerId,
      userId,
      reason,
    });
    return await this.blockedUserRepository.save(block);
  }

  async unblockUser(ownerId: number, userId: number): Promise<{ success: boolean; message: string }> {
    const block = await this.blockedUserRepository.findOne({
      where: { ownerId, userId },
    });
    if (!block) {
      throw new NotFoundException('Blocked user entry not found');
    }
    await this.blockedUserRepository.remove(block);
    return { success: true, message: 'User successfully unblocked' };
  }

  async getBlockedUsers(ownerId: number): Promise<BlockedUser[]> {
    return await this.blockedUserRepository.find({
      where: { ownerId },
      relations: ['user'],
    });
  }

  async isUserBlockedByOwner(ownerId: number, userId: number): Promise<boolean> {
    const block = await this.blockedUserRepository.findOne({
      where: { ownerId, userId },
    });
    return !!block;
  }

  async findAllRegularUsers(): Promise<Omit<User, 'password'>[]> {
    return await this.userRepository.find({
      where: { role: UserRole.REGULAR_USER },
      select: ['id', 'name', 'email', 'phone', 'address', 'role', 'isBlocked', 'createdAt'],
    });
  }
}
