import {
  Controller,
  Get,
  Post,
  Patch,
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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Checkout current server cart into an order (Customer)' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Cart is empty' })
  @ApiResponse({ status: 403, description: 'Blocked by restaurant owner' })
  async create(
    @CurrentUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user.id, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user order history (Customer)' })
  @ApiResponse({ status: 200, description: 'List of user orders' })
  async getUserOrders(@CurrentUser() user: User) {
    return this.ordersService.getUserOrders(user.id);
  }

  @Get('owner')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Get incoming live orders for owned restaurants (Owner only)' })
  @ApiResponse({ status: 200, description: 'List of owner orders' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  async getOwnerOrders(@CurrentUser() owner: User) {
    return this.ordersService.getOwnerOrders(owner.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID with items and tracking status' })
  @ApiResponse({ status: 200, description: 'Order details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderById(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.findOneForUser(id, user);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  @ApiOperation({ summary: 'Advance order status (PLACED -> PREPARING -> ON_THE_WAY -> DELIVERED)' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  @ApiResponse({ status: 403, description: 'Forbidden: You do not own this restaurant' })
  async updateStatus(
    @CurrentUser() owner: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(
      owner.id,
      id,
      updateOrderStatusDto.status,
    );
  }
}
