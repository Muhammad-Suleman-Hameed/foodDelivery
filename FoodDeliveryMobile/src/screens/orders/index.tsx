import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Receipt, RotateCw, ChevronRight, Package } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import Colors from '../../theme/colors';
import { CustomText } from '../../components/customText';
import { CustomButton } from '../../components/customButton';
import { OrderStatus } from '../../types/order';
import { useOrders } from '../../hooks/useOrders';
import { formatOrderStatus } from '../../utils/formatters';
import { styles } from './styles';

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orders, loading, fetchOrders } = useOrders();

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PLACED:
        return { bg: Colors.infoLight, text: Colors.info };
      case OrderStatus.PREPARING:
        return { bg: Colors.warningLight, text: Colors.warning };
      case OrderStatus.ON_THE_WAY:
        return { bg: Colors.primaryLight, text: Colors.primary };
      case OrderStatus.DELIVERED:
        return { bg: Colors.successLight, text: Colors.success };
      case OrderStatus.CANCELLED:
        return { bg: Colors.errorLight, text: Colors.error };
      default:
        return { bg: Colors.surfaceGray, text: Colors.charcoal };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.headerTitle}>
          My Orders
        </CustomText>

        <TouchableOpacity onPress={fetchOrders} style={styles.refreshBtn}>
          <RotateCw size={18} color={Colors.charcoal} />
        </TouchableOpacity>
      </View>

      {loading && orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Package size={36} color={Colors.textLight} />
          </View>
          <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.emptyTitle}>
            No Orders Placed
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted} style={styles.emptyDesc}>
            Your past and active orders will show up here. Explore restaurants to place your first order.
          </CustomText>
          <View style={{ width: '60%' }}>
            <CustomButton
              title="Explore Restaurants"
              onPress={() => navigation.navigate('Home' as any)}
            />
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchOrders}
              tintColor={Colors.primary}
            />
          }
        >
          {orders.map((order) => {
            const statusStyle = getStatusStyle(order.status);
            const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <TouchableOpacity
                key={order.id}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
                style={styles.orderCard}
              >
                <View style={styles.cardTop}>
                  <View>
                    <CustomText weight="bold" color={Colors.charcoal} style={styles.restaurantName}>
                      {order.restaurant?.name || 'Restaurant'}
                    </CustomText>
                    <CustomText variant="caption" color={Colors.textLight} style={styles.orderDate}>
                      Order #{order.id} • {dateStr}
                    </CustomText>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <CustomText style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                      {formatOrderStatus(order.status)}
                    </CustomText>
                  </View>
                </View>

                {/* Items Summary */}
                <View style={styles.itemsList}>
                  {order.items.map((item) => (
                    <CustomText key={item.id} color={Colors.textMuted} style={styles.itemText}>
                      {item.quantity}x {item.mealName} (${Number(item.price).toFixed(2)})
                    </CustomText>
                  ))}
                </View>

                {/* Card Bottom */}
                <View style={styles.cardBottom}>
                  <CustomText weight="bold" color={Colors.charcoal}>
                    Total: ${Number(order.totalAmount).toFixed(2)}
                  </CustomText>

                  <View style={styles.trackAction}>
                    <CustomText style={styles.trackText}>Track Order</CustomText>
                    <ChevronRight size={16} color={Colors.primary} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default OrdersScreen;
