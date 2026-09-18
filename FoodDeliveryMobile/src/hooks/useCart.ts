import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { CartSummary, CartItem } from '../types/cart';
import axios from '../utils/axios';
import { API } from '../constants/api';

export const useCart = () => {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await axios.get<CartSummary>(API.CART);
      setCart(data);
    } catch (err) {
      console.log('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (mealId: number, quantity = 1) => {
    try {
      const updated = await axios.post<CartSummary>(API.CART_ITEMS, {
        mealId,
        quantity,
      });
      setCart(updated);
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Unable to add item to cart';
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
      throw err;
    }
  };

  const updateQuantity = async (item: CartItem, newQty: number) => {
    try {
      setUpdatingId(item.id);
      const updated = await axios.patch<CartSummary>(
        API.CART_ITEM_DETAIL(item.id),
        { quantity: newQty },
      );
      setCart(updated);
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Unable to update quantity';
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
      throw err;
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setUpdatingId(itemId);
      const updated = await axios.delete<CartSummary>(API.CART_ITEM_DETAIL(itemId));
      setCart(updated);
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Unable to remove item';
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
      throw err;
    } finally {
      setUpdatingId(null);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(API.CART);
      setCart(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Unable to clear cart';
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
      throw err;
    }
  };

  return {
    cart,
    loading,
    updatingId,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
};

export default useCart;
