import { OrderStatus } from '../types/order';

/**
 * Converts raw backend OrderStatus enum into human-readable capitalized text.
 * E.g., 'ON_THE_WAY' -> 'On the Way', 'PLACED' -> 'Placed'
 */
export const formatOrderStatus = (status?: OrderStatus | string | null): string => {
  if (!status) return 'Pending';

  switch (status) {
    case OrderStatus.PLACED:
    case 'PLACED':
      return 'Placed';
    case OrderStatus.PREPARING:
    case 'PREPARING':
      return 'Preparing';
    case OrderStatus.ON_THE_WAY:
    case 'ON_THE_WAY':
      return 'On the Way';
    case OrderStatus.DELIVERED:
    case 'DELIVERED':
      return 'Delivered';
    case OrderStatus.CANCELLED:
    case 'CANCELLED':
      return 'Cancelled';
    default:
      // Fallback: replace underscores and Title Case
      return String(status)
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
};

/**
 * Converts raw backend PaymentMethod enum into human-readable text.
 * E.g., 'CASH_ON_DELIVERY' -> 'Cash on Delivery', 'CARD' -> 'Card Payment'
 */
export const formatPaymentMethod = (method?: string | null): string => {
  if (!method) return 'Cash on Delivery';

  switch (method) {
    case 'CASH_ON_DELIVERY':
      return 'Cash on Delivery';
    case 'CARD':
      return 'Card Payment';
    default:
      return String(method)
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
};

/**
 * Converts raw backend UserRole enum into human-readable text.
 * E.g., 'REGULAR_USER' -> 'Customer', 'RESTAURANT_OWNER' -> 'Restaurant Partner'
 */
export const formatUserRole = (role?: string | null): string => {
  if (!role) return 'Customer';

  switch (role) {
    case 'RESTAURANT_OWNER':
      return 'Restaurant Partner';
    case 'REGULAR_USER':
      return 'Customer Account';
    default:
      return String(role)
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
};
