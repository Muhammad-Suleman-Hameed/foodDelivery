import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Meal } from '../meals/entities/meal.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  restaurant: Restaurant | null;
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async getCart(userId: number): Promise<CartSummary> {
    const items = await this.cartItemRepository.find({
      where: { userId },
      relations: ['meal', 'restaurant'],
      order: { createdAt: 'ASC' },
    });

    if (!items || items.length === 0) {
      return {
        items: [],
        itemCount: 0,
        subtotal: 0,
        deliveryFee: 0,
        total: 0,
        restaurant: null,
      };
    }

    const restaurant = items[0].restaurant;
    const deliveryFee = Number(restaurant?.deliveryFee || 1.49);

    let subtotal = 0;
    let itemCount = 0;

    for (const item of items) {
      const price = Number(item.meal?.price || 0);
      subtotal += price * item.quantity;
      itemCount += item.quantity;
    }

    subtotal = Math.round(subtotal * 100) / 100;
    const total = Math.round((subtotal + deliveryFee) * 100) / 100;

    return {
      items,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      restaurant,
    };
  }

  async addItem(userId: number, dto: AddCartItemDto): Promise<CartSummary> {
    const meal = await this.mealRepository.findOne({
      where: { id: dto.mealId },
      relations: ['restaurant'],
    });

    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    if (!meal.isAvailable) {
      throw new BadRequestException('This meal is currently sold out');
    }

    // Check if user already has items from another restaurant
    const existingItems = await this.cartItemRepository.find({
      where: { userId },
    });

    if (existingItems.length > 0 && existingItems[0].restaurantId !== meal.restaurantId) {
      // Clear cart from previous restaurant
      await this.cartItemRepository.delete({ userId });
    }

    const quantityToAdd = dto.quantity || 1;

    let cartItem = await this.cartItemRepository.findOne({
      where: { userId, mealId: dto.mealId },
    });

    if (cartItem) {
      cartItem.quantity += quantityToAdd;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        userId,
        mealId: meal.id,
        restaurantId: meal.restaurantId,
        quantity: quantityToAdd,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(userId);
  }

  async updateItemQuantity(
    userId: number,
    itemId: number,
    dto: UpdateCartItemDto,
  ): Promise<CartSummary> {
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (dto.quantity <= 0) {
      await this.cartItemRepository.remove(item);
    } else {
      item.quantity = dto.quantity;
      await this.cartItemRepository.save(item);
    }

    return this.getCart(userId);
  }

  async removeItem(userId: number, itemId: number): Promise<CartSummary> {
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(item);
    return this.getCart(userId);
  }

  async clearCart(userId: number): Promise<{ success: boolean; message: string }> {
    await this.cartItemRepository.delete({ userId });
    return { success: true, message: 'Cart cleared successfully' };
  }
}
