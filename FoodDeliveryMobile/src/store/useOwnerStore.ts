import { create } from 'zustand';
import { Alert } from 'react-native';
import { Restaurant, CreateRestaurantInput } from '../types/restaurant';
import { Meal, CreateMealInput } from '../types/meal';
import { Order, OrderStatus } from '../types/order';
import axios from '../utils/axios';
import { API } from '../constants/api';

export interface OwnerCustomer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  orderCount: number;
  lastOrderDate?: string;
}

interface OwnerState {
  // Restaurants
  restaurants: Restaurant[];
  restaurantsLoading: boolean;

  // Orders
  orders: Order[];
  ordersLoading: boolean;
  updatingOrderId: number | null;

  // Blocked Users
  blockedUsers: any[];
  blockedLoading: boolean;

  // Meals for selected restaurant
  selectedRestaurant: Restaurant | null;
  meals: Meal[];
  mealsLoading: boolean;

  // Modals
  restaurantModalVisible: boolean;
  editingRestaurant: Restaurant | null;
  mealsModalVisible: boolean;

  // Actions
  fetchRestaurants: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchBlockedUsers: () => Promise<void>;
  fetchMeals: (restaurantId: number) => Promise<void>;

  setRestaurantModalVisible: (visible: boolean) => void;
  setEditingRestaurant: (restaurant: Restaurant | null) => void;
  setMealsModalVisible: (visible: boolean) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;

  saveRestaurant: (payload: CreateRestaurantInput, editingId?: number | null) => Promise<void>;
  deleteRestaurant: (id: number) => Promise<void>;

  createMeal: (restaurantId: number, payload: CreateMealInput) => Promise<Meal>;
  toggleMealAvailability: (mealId: number) => Promise<Meal>;
  deleteMeal: (mealId: number) => Promise<void>;

  updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<Order>;
  blockUser: (userId: number, reason?: string) => Promise<void>;
  unblockUser: (userId: number) => Promise<void>;

  // Getters
  isUserBlocked: (userId: number) => boolean;
  getCustomers: () => OwnerCustomer[];
}

export const useOwnerStore = create<OwnerState>((set, get) => ({
  restaurants: [],
  restaurantsLoading: false,

  orders: [],
  ordersLoading: false,
  updatingOrderId: null,

  blockedUsers: [],
  blockedLoading: false,

  selectedRestaurant: null,
  meals: [],
  mealsLoading: false,

  restaurantModalVisible: false,
  editingRestaurant: null,
  mealsModalVisible: false,

  fetchRestaurants: async () => {
    try {
      set({ restaurantsLoading: true });
      const data = await axios.get<Restaurant[]>(API.RESTAURANTS_MY);
      set({ restaurants: data });
    } catch (err) {
      console.log('Error loading restaurants:', err);
    } finally {
      set({ restaurantsLoading: false });
    }
  },

  fetchOrders: async () => {
    try {
      set({ ordersLoading: true });
      const data = await axios.get<Order[]>(API.ORDERS_OWNER);
      set({ orders: data });
    } catch (err) {
      console.log('Error loading orders:', err);
    } finally {
      set({ ordersLoading: false });
    }
  },

  fetchBlockedUsers: async () => {
    try {
      set({ blockedLoading: true });
      const data = await axios.get<any[]>(API.USERS_BLOCKED);
      set({ blockedUsers: data });
    } catch (err) {
      console.log('Error loading blocked users:', err);
    } finally {
      set({ blockedLoading: false });
    }
  },

  fetchMeals: async (restaurantId: number) => {
    try {
      set({ mealsLoading: true });
      const data = await axios.get<Meal[]>(API.RESTAURANT_MEALS(restaurantId));
      set({ meals: data });
    } catch (err) {
      console.log('Error loading meals:', err);
    } finally {
      set({ mealsLoading: false });
    }
  },

  setRestaurantModalVisible: (visible) => set({ restaurantModalVisible: visible }),
  setEditingRestaurant: (restaurant) => set({ editingRestaurant: restaurant }),
  setMealsModalVisible: (visible) => set({ mealsModalVisible: visible }),
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),

  saveRestaurant: async (payload, editingId) => {
    if (editingId) {
      await axios.patch(`${API.RESTAURANTS}/${editingId}`, payload);
    } else {
      await axios.post(API.RESTAURANTS, payload);
    }
    await get().fetchRestaurants();
  },

  deleteRestaurant: async (id) => {
    await axios.delete(`${API.RESTAURANTS}/${id}`);
    set((state) => ({
      restaurants: state.restaurants.filter((r) => r.id !== id),
    }));
  },

  createMeal: async (restaurantId, payload) => {
    const newMeal = await axios.post<Meal>(API.RESTAURANT_MEALS(restaurantId), payload);
    set((state) => ({
      meals: [newMeal, ...state.meals],
    }));
    return newMeal;
  },

  toggleMealAvailability: async (mealId) => {
    const updated = await axios.patch<Meal>(API.MEAL_TOGGLE(mealId));
    set((state) => ({
      meals: state.meals.map((m) => (m.id === mealId ? updated : m)),
    }));
    return updated;
  },

  deleteMeal: async (mealId) => {
    await axios.delete(API.MEAL_DETAIL(mealId));
    set((state) => ({
      meals: state.meals.filter((m) => m.id !== mealId),
    }));
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      set({ updatingOrderId: orderId });
      const updated = await axios.patch<Order>(API.ORDER_STATUS(orderId), { status });
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? updated : o)),
      }));
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update order status';
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
      throw err;
    } finally {
      set({ updatingOrderId: null });
    }
  },

  blockUser: async (userId, reason) => {
    try {
      await axios.post(API.USERS_BLOCK, {
        userId,
        reason: reason || 'Blocked by owner',
      });
      await get().fetchBlockedUsers();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to block customer';
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
      throw err;
    }
  },

  unblockUser: async (userId) => {
    try {
      await axios.delete(API.USERS_UNBLOCK(userId));
      set((state) => ({
        blockedUsers: state.blockedUsers.filter((b) => b.userId !== userId),
      }));
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to unblock customer';
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
      throw err;
    }
  },

  isUserBlocked: (userId: number) => {
    return get().blockedUsers.some((b) => Number(b.userId) === Number(userId));
  },

  getCustomers: () => {
    const orders = get().orders;
    const blockedUsers = get().blockedUsers;
    const map = new Map<number, OwnerCustomer>();

    orders.forEach((o) => {
      if (o.userId && o.user) {
        const existing = map.get(o.userId);
        if (existing) {
          existing.orderCount += 1;
        } else {
          map.set(o.userId, {
            id: o.userId,
            name: o.user.name,
            email: o.user.email,
            phone: o.user.phone || undefined,
            address: o.deliveryAddress,
            orderCount: 1,
            lastOrderDate: o.createdAt,
          });
        }
      }
    });

    // Also include any blocked user in the comprehensive customer list
    blockedUsers.forEach((b) => {
      const uId = Number(b.userId);
      if (uId && !map.has(uId)) {
        map.set(uId, {
          id: uId,
          name: b.user?.name || `Customer #${uId}`,
          email: b.user?.email || 'N/A',
          phone: b.user?.phone || undefined,
          address: undefined,
          orderCount: 0,
        });
      }
    });

    return Array.from(map.values());
  },
}));

export default useOwnerStore;
