import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly cartService: CartService,
    private readonly usersService: UsersService,
  ) {}

  async createOrder(userId: number, dto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartService.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty. Add meals before placing an order.');
    }

    const restaurantId = cart.items[0].restaurantId;
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Owner Block check: Verify if customer is blocked by this restaurant's owner
    const isBlocked = await this.usersService.isUserBlockedByOwner(restaurant.ownerId, userId);
    if (isBlocked) {
      throw new ForbiddenException(
        'You have been blocked by this restaurant owner and cannot place orders here.',
      );
    }

    // Create Order Record
    const order = this.orderRepository.create({
      userId,
      restaurantId,
      status: OrderStatus.PLACED,
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      totalAmount: cart.total,
      deliveryAddress: dto.deliveryAddress,
      paymentMethod: dto.paymentMethod,
      notes: dto.notes,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create Order Items Snapshot
    const orderItems: OrderItem[] = cart.items.map((cartItem) => {
      return this.orderItemRepository.create({
        orderId: savedOrder.id,
        mealId: cartItem.mealId,
        mealName: cartItem.meal?.name || 'Delicious Meal',
        price: Number(cartItem.meal?.price || 0),
        quantity: cartItem.quantity,
      });
    });

    await this.orderItemRepository.save(orderItems);

    // Clear user cart on server
    await this.cartService.clearCart(userId);

    // Return order with relations
    return this.findOne(savedOrder.id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['restaurant', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOwnerOrders(ownerId: number): Promise<Order[]> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.restaurant', 'restaurant')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.user', 'user')
      .where('restaurant.ownerId = :ownerId', { ownerId })
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['restaurant', 'items', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async findOneForUser(id: number, user: User): Promise<Order> {
    const order = await this.findOne(id);

    // Check authorization: Must be the customer OR the restaurant owner
    const isCustomer = order.userId === user.id;
    const isOwner = order.restaurant?.ownerId === user.id;

    if (!isCustomer && !isOwner) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  async updateStatus(
    ownerId: number,
    orderId: number,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.findOne(orderId);

    if (order.restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own the restaurant for this order');
    }

    order.status = status;
    await this.orderRepository.save(order);

    return this.findOne(orderId);
  }
}
