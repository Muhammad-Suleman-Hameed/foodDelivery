import { Meal } from './meal';
import { Restaurant } from './restaurant';

export interface CartItem {
  id: number;
  userId: number;
  restaurantId: number;
  restaurant?: Restaurant;
  mealId: number;
  meal?: Meal;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  restaurant: Restaurant | null;
}
