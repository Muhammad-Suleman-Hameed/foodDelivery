export const API = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile',

  // Restaurants & Menu
  RESTAURANTS: '/restaurants',
  RESTAURANTS_MY: '/restaurants/my',
  RESTAURANT_DETAIL: (id: number) => `/restaurants/${id}`,
  CATEGORIES: '/restaurants/categories',
  RESTAURANT_MEALS: (restaurantId: number) => `/restaurants/${restaurantId}/meals`,
  MEAL_DETAIL: (id: number) => `/meals/${id}`,
  MEAL_TOGGLE: (id: number) => `/meals/${id}/toggle`,

  // Cart (Server-side only)
  CART: '/cart',
  CART_ITEMS: '/cart/items',
  CART_ITEM_DETAIL: (id: number) => `/cart/items/${id}`,

  // Orders & Tracking
  ORDERS: '/orders',
  ORDERS_OWNER: '/orders/owner',
  ORDER_DETAIL: (id: number) => `/orders/${id}`,
  ORDER_STATUS: (id: number) => `/orders/${id}/status`,

  // User Management & Blocking
  USERS_BLOCK: '/users/block',
  USERS_UNBLOCK: (userId: number) => `/users/unblock/${userId}`,
  USERS_BLOCKED: '/users/blocked',
};
