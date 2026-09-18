import { useState, useEffect, useCallback, useMemo } from 'react';
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

export const useOwnerDashboard = () => {
  // Tab State
  const [activeTab, setActiveTab] = useState<'restaurants' | 'orders' | 'blocked'>('restaurants');

  // Restaurants State
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // Blocked Users State
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [blockedLoading, setBlockedLoading] = useState(false);

  // Meals State for selected restaurant
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(false);

  // Fetch functions
  const fetchMyRestaurants = useCallback(async () => {
    try {
      setRestaurantsLoading(true);
      const data = await axios.get<Restaurant[]>(API.RESTAURANTS_MY);
      setRestaurants(data);
    } catch (err) {
      console.log('Error loading restaurants:', err);
    } finally {
      setRestaurantsLoading(false);
    }
  }, []);

  const fetchOwnerOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const data = await axios.get<Order[]>(API.ORDERS_OWNER);
      setOrders(data);
    } catch (err) {
      console.log('Error loading orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const fetchBlockedUsers = useCallback(async () => {
    try {
      setBlockedLoading(true);
      const data = await axios.get<any[]>(API.USERS_BLOCKED);
      setBlockedUsers(data);
    } catch (err) {
      console.log('Error loading blocked users:', err);
    } finally {
      setBlockedLoading(false);
    }
  }, []);

  const fetchMealsForRestaurant = useCallback(async (restaurantId: number) => {
    try {
      setMealsLoading(true);
      const data = await axios.get<Meal[]>(API.RESTAURANT_MEALS(restaurantId));
      setMeals(data);
    } catch (err) {
      console.log('Error loading meals:', err);
    } finally {
      setMealsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyRestaurants();
    fetchOwnerOrders();
    fetchBlockedUsers();
  }, [fetchMyRestaurants, fetchOwnerOrders, fetchBlockedUsers]);

  // Restaurant Actions
  const saveRestaurant = async (payload: CreateRestaurantInput, editingId?: number | null) => {
    if (editingId) {
      await axios.patch(`${API.RESTAURANTS}/${editingId}`, payload);
    } else {
      await axios.post(API.RESTAURANTS, payload);
    }
    fetchMyRestaurants();
  };

  const deleteRestaurant = async (id: number) => {
    await axios.delete(`${API.RESTAURANTS}/${id}`);
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
  };

  // Meals Actions
  const createMeal = async (restaurantId: number, payload: CreateMealInput) => {
    const newMeal = await axios.post<Meal>(API.RESTAURANT_MEALS(restaurantId), payload);
    setMeals((prev) => [newMeal, ...prev]);
    return newMeal;
  };

  const toggleMealAvailability = async (mealId: number) => {
    const updated = await axios.patch<Meal>(API.MEAL_TOGGLE(mealId));
    setMeals((prev) => prev.map((m) => (m.id === mealId ? updated : m)));
    return updated;
  };

  const deleteMeal = async (mealId: number) => {
    await axios.delete(API.MEAL_DETAIL(mealId));
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  // Order Actions
  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const updated = await axios.patch<Order>(API.ORDER_STATUS(orderId), { status });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update order status';
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
      throw err;
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Blocking Actions
  const blockUser = async (userId: number, reason?: string) => {
    try {
      await axios.post(API.USERS_BLOCK, {
        userId,
        reason: reason || 'Blocked by owner via orders feed',
      });
      await fetchBlockedUsers();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to block customer';
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
      throw err;
    }
  };

  const unblockUser = async (userId: number) => {
    try {
      await axios.delete(API.USERS_UNBLOCK(userId));
      setBlockedUsers((prev) => prev.filter((b) => b.userId !== userId));
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to unblock customer';
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
      throw err;
    }
  };

  const isUserBlocked = useCallback(
    (userId: number) => {
      return blockedUsers.some((b) => Number(b.userId) === Number(userId));
    },
    [blockedUsers],
  );

  const customers = useMemo<OwnerCustomer[]>(() => {
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

    return Array.from(map.values());
  }, [orders]);

  return {
    activeTab,
    setActiveTab,
    restaurants,
    restaurantsLoading,
    orders,
    ordersLoading,
    updatingOrderId,
    blockedUsers,
    blockedLoading,
    customers,
    selectedRestaurant,
    setSelectedRestaurant,
    meals,
    mealsLoading,
    fetchMyRestaurants,
    fetchOwnerOrders,
    fetchBlockedUsers,
    fetchMealsForRestaurant,
    saveRestaurant,
    deleteRestaurant,
    createMeal,
    toggleMealAvailability,
    deleteMeal,
    updateOrderStatus,
    blockUser,
    unblockUser,
    isUserBlocked,
  };
};

export default useOwnerDashboard;
