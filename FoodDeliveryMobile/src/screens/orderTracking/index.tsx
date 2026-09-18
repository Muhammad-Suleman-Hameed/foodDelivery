import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  RotateCw,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Check,
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import Colors from '../../theme/colors';
import { CustomText } from '../../components/customText';
import { CustomButton } from '../../components/customButton';
import { Order, OrderStatus } from '../../types/order';
import axios from '../../utils/axios';
import { API } from '../../constants/api';
import { styles } from './styles';

type RouteProps = RouteProp<RootStackParamList, 'OrderTracking'>;

const ORDER_STEPS = [
  {
    status: OrderStatus.PLACED,
    title: 'Order Placed',
    description: 'We have received your order.',
  },
  {
    status: OrderStatus.PREPARING,
    title: 'Preparing',
    description: 'The kitchen is preparing your meals.',
  },
  {
    status: OrderStatus.ON_THE_WAY,
    title: 'On the Way',
    description: 'Your courier has picked up the order.',
  },
  {
    status: OrderStatus.DELIVERED,
    title: 'Delivered',
    description: 'Order delivered to your destination.',
  },
];

const STATUS_ORDER_INDEX: Record<OrderStatus, number> = {
  [OrderStatus.PLACED]: 0,
  [OrderStatus.PREPARING]: 1,
  [OrderStatus.ON_THE_WAY]: 2,
  [OrderStatus.DELIVERED]: 3,
  [OrderStatus.CANCELLED]: -1,
};

export const OrderTrackingScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orderId } = route.params;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const data = await axios.get<Order>(API.ORDER_DETAIL(orderId));
      setOrder(data);
    } catch (err) {
      console.log('Error fetching order status:', err);
      Alert.alert('Error', 'Unable to retrieve order tracking info.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();

    // Auto poll status every 10 seconds while on tracking screen
    const interval = setInterval(() => {
      fetchOrder(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOrder]);

  const currentStepIndex = order ? STATUS_ORDER_INDEX[order.status] : 0;
  const isCancelled = order?.status === OrderStatus.CANCELLED;

  const renderStatusIcon = () => {
    if (isCancelled) {
      return <XCircle size={44} color={Colors.error} strokeWidth={1.8} />;
    }
    switch (order?.status) {
      case OrderStatus.DELIVERED:
        return <CheckCircle2 size={44} color={Colors.success} strokeWidth={1.8} />;
      case OrderStatus.ON_THE_WAY:
        return <Truck size={44} color={Colors.white} strokeWidth={1.8} />;
      case OrderStatus.PREPARING:
        return <Clock size={44} color={Colors.white} strokeWidth={1.8} />;
      default:
        return <Package size={44} color={Colors.white} strokeWidth={1.8} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs')}
          style={styles.refreshButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={Colors.charcoal} strokeWidth={2.2} />
        </TouchableOpacity>

        <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.headerTitle}>
          Order #{orderId} Status
        </CustomText>

        <TouchableOpacity
          onPress={() => fetchOrder(true)}
          style={styles.refreshButton}
          disabled={refreshing}
          activeOpacity={0.7}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <RotateCw size={18} color={Colors.charcoal} strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>

      {loading && !order ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : order ? (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Status Hero Card */}
            <View style={styles.bannerCard}>
              <View style={{ marginBottom: 12 }}>
                {renderStatusIcon()}
              </View>
              <CustomText variant="title" weight="bold" color={Colors.white} style={styles.bannerTitle}>
                {isCancelled
                  ? 'Order Cancelled'
                  : order.status === OrderStatus.DELIVERED
                  ? 'Order Delivered'
                  : order.status === OrderStatus.ON_THE_WAY
                  ? 'On the Way'
                  : order.status === OrderStatus.PREPARING
                  ? 'Kitchen Preparing'
                  : 'Order Confirmed'}
              </CustomText>
              <CustomText color={Colors.white} style={styles.bannerSubtitle}>
                Estimated Delivery: 25-35 mins • {order.restaurant?.name}
              </CustomText>
            </View>

            {/* Visual Stepper */}
            {!isCancelled ? (
              <View style={styles.stepperCard}>
                <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.stepperTitle}>
                  Delivery Progress
                </CustomText>

                {ORDER_STEPS.map((step, idx) => {
                  const isDelivered = order.status === OrderStatus.DELIVERED;
                  const isDone = isDelivered ? true : currentStepIndex > idx;
                  const isActive = !isDelivered && currentStepIndex === idx;
                  const isLast = idx === ORDER_STEPS.length - 1;

                  return (
                    <View key={step.status} style={styles.stepRow}>
                      <View style={styles.stepIndicatorCol}>
                        <View
                          style={[
                            styles.stepCircle,
                            (isDone ? styles.stepCircleDone : {}) as any,
                            (isActive ? styles.stepCircleActive : {}) as any,
                          ]}
                        >
                          {isDone ? (
                            <Check size={14} color={Colors.white} strokeWidth={2.6} />
                          ) : (
                            <CustomText
                              style={[
                                styles.stepIcon,
                                (isActive ? { color: Colors.white, fontWeight: '700' } : {}) as any,
                              ]}
                            >
                              {idx + 1}
                            </CustomText>
                          )}
                        </View>
                        {!isLast ? (
                          <View style={[styles.stepLine, (isDone ? styles.stepLineDone : {}) as any]} />
                        ) : null}
                      </View>

                      <View style={styles.stepContent}>
                        <CustomText
                          weight="bold"
                          color={isActive ? Colors.primary : Colors.charcoal}
                          style={styles.stepTitle}
                        >
                          {step.title}
                        </CustomText>
                        <CustomText
                          color={isActive || isDone ? Colors.charcoal : Colors.textMuted}
                          style={styles.stepDesc}
                        >
                          {step.description}
                        </CustomText>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : null}

            {/* Restaurant & Delivery Details */}
            <View style={styles.infoCard}>
              <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.infoTitle}>
                Delivery Details
              </CustomText>
              <CustomText weight="bold" color={Colors.charcoal}>
                Restaurant: {order.restaurant?.name}
              </CustomText>
              <CustomText variant="caption" color={Colors.textMuted} style={{ marginTop: 2 }}>
                Address: {order.deliveryAddress}
              </CustomText>
              <CustomText variant="caption" color={Colors.textMuted} style={{ marginTop: 2 }}>
                Payment: {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Card Payment'}
              </CustomText>
            </View>

            {/* Items Breakdown */}
            <View style={styles.infoCard}>
              <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.infoTitle}>
                Items ({order.items.length})
              </CustomText>

              {order.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <CustomText color={Colors.charcoal} style={styles.itemName}>
                    {item.quantity}x {item.mealName}
                  </CustomText>
                  <CustomText weight="bold" color={Colors.charcoal} style={styles.itemPrice}>
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </CustomText>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <CustomText variant="title" weight="bold" color={Colors.charcoal}>
                  Total
                </CustomText>
                <CustomText variant="title" weight="bold" color={Colors.primary}>
                  ${Number(order.totalAmount).toFixed(2)}
                </CustomText>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Back CTA */}
          <View style={styles.bottomBar}>
            <CustomButton
              title="Return to Home"
              variant="secondary"
              onPress={() => navigation.navigate('MainTabs')}
            />
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default OrderTrackingScreen;
