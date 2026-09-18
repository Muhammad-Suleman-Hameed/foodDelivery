import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Order, CreateOrderInput } from '../types/order';
import axios from '../utils/axios';
import { API } from '../constants/api';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await axios.get<Order[]>(API.ORDERS);
      setOrders(data);
    } catch (err) {
      console.log('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = async (input: CreateOrderInput): Promise<Order> => {
    try {
      setSubmitting(true);
      const newOrder = await axios.post<Order>(API.ORDERS, input);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || 'Failed to place order';

      if (status === 403) {
        Alert.alert(
          'Order Blocked',
          msg || 'You have been blocked from placing orders by this restaurant owner.',
        );
      } else {
        Alert.alert('Order Failed', Array.isArray(msg) ? msg[0] : msg);
      }
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    orders,
    loading,
    submitting,
    fetchOrders,
    placeOrder,
  };
};

export default useOrders;
