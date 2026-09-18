import { Restaurant } from './restaurant';
import { User } from '../store/useAuthStore';

export enum OrderStatus {
  PLACED = 'PLACED',
  PREPARING = 'PREPARING',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  CARD = 'CARD',
}

export interface OrderItem {
  id: number;
  orderId: number;
  mealId: number;
  mealName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  user?: User;
  restaurantId: number;
  restaurant?: Restaurant;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  deliveryAddress: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}
