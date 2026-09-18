import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { BlockUserDto } from './dto/block-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserRole } from './entities/user.entity';

@ApiTags('Users & Blocking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('block')
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Restaurant Owner blocks a regular user' })
  @ApiResponse({ status: 201, description: 'User blocked successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: Only Restaurant Owners can block users' })
  async blockUser(
    @CurrentUser() owner: User,
    @Body() dto: BlockUserDto,
  ) {
    return this.usersService.blockUser(owner.id, dto.userId, dto.reason);
  }

  @Delete('unblock/:userId')
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Restaurant Owner unblocks a regular user' })
  @ApiResponse({ status: 200, description: 'User unblocked successfully' })
  async unblockUser(
    @CurrentUser() owner: User,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.usersService.unblockUser(owner.id, userId);
  }

  @Get('blocked')
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Get list of users blocked by this restaurant owner' })
  @ApiResponse({ status: 200, description: 'List of blocked users' })
  async getBlockedUsers(@CurrentUser() owner: User) {
    return this.usersService.getBlockedUsers(owner.id);
  }

  @Get('customers')
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Get list of all regular users for owner management' })
  @ApiResponse({ status: 200, description: 'List of regular users' })
  async getCustomers() {
    return this.usersService.findAllRegularUsers();
  }
}
