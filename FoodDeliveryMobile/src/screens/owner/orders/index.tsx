import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RotateCw,
  Package,
  User,
  MapPin,
  UserX,
  CheckCircle2,
} from 'lucide-react-native';
import Colors from '../../../theme/colors';
import { CustomText } from '../../../components/customText';
import { useOwnerStore } from '../../../store/useOwnerStore';
import { Order, OrderStatus } from '../../../types/order';
import { styles } from '../../ownerDashboard/styles';

const STATUS_FILTERS: { key: string; label: string; status?: OrderStatus }[] = [
  { key: 'ALL', label: 'All' },
  { key: OrderStatus.PLACED, label: 'Placed', status: OrderStatus.PLACED },
  { key: OrderStatus.PREPARING, label: 'Preparing', status: OrderStatus.PREPARING },
  { key: OrderStatus.ON_THE_WAY, label: 'On the Way', status: OrderStatus.ON_THE_WAY },
  { key: OrderStatus.DELIVERED, label: 'Delivered', status: OrderStatus.DELIVERED },
  { key: OrderStatus.CANCELLED, label: 'Cancelled', status: OrderStatus.CANCELLED },
];

export const OwnerOrdersScreen: React.FC = () => {
  const {
    orders,
    ordersLoading,
    updatingOrderId,
    fetchOrders,
    updateOrderStatus,
    isUserBlocked,
  } = useOwnerStore();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Counts per status
  const counts = useMemo(() => {
    const c: Record<string, number> = {
      ALL: orders.length,
      [OrderStatus.PLACED]: 0,
      [OrderStatus.PREPARING]: 0,
      [OrderStatus.ON_THE_WAY]: 0,
      [OrderStatus.DELIVERED]: 0,
      [OrderStatus.CANCELLED]: 0,
    };
    orders.forEach((o) => {
      if (c[o.status] !== undefined) {
        c[o.status] += 1;
      }
    });
    return c;
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    if (selectedStatusFilter === 'ALL') return orders;
    return orders.filter((o) => o.status === selectedStatusFilter);
  }, [orders, selectedStatusFilter]);

  const getStatusColor = (status: OrderStatus) => {
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

  const formatStatus = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PLACED:
        return 'Placed';
      case OrderStatus.PREPARING:
        return 'Preparing';
      case OrderStatus.ON_THE_WAY:
        return 'On the Way';
      case OrderStatus.DELIVERED:
        return 'Delivered';
      case OrderStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View>
          <CustomText variant="h2" weight="bold" color={Colors.charcoal}>
            Orders
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted}>
            Live order tracking and kitchen management
          </CustomText>
        </View>

        <TouchableOpacity onPress={fetchOrders} style={styles.refreshBtn} activeOpacity={0.7}>
          <RotateCw size={14} color={Colors.charcoal} style={{ marginRight: 4 }} />
          <CustomText style={styles.refreshBtnText}>Refresh</CustomText>
        </TouchableOpacity>
      </View>

      {/* In-Screen Status Filter Tabs Carousel */}
      <View style={{ backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
        >
          {STATUS_FILTERS.map((tab) => {
            const isActive = selectedStatusFilter === tab.key;
            const count = counts[tab.key] || 0;

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setSelectedStatusFilter(tab.key)}
                activeOpacity={0.75}
                style={[
                  {
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor: isActive ? Colors.primary : Colors.surfaceGray,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  },
                ]}
              >
                <CustomText
                  weight="600"
                  style={{
                    fontSize: 12,
                    color: isActive ? Colors.white : Colors.charcoal,
                  }}
                >
                  {tab.label}
                </CustomText>
                <View
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : Colors.border,
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                    borderRadius: 10,
                  }}
                >
                  <CustomText
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: isActive ? Colors.white : Colors.charcoal,
                    }}
                  >
                    {count}
                  </CustomText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders Feed */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {ordersLoading && orders.length === 0 ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : filteredOrders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Package size={44} color={Colors.textLight} style={{ marginBottom: 12 }} />
            <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.emptyText}>
              No {selectedStatusFilter === 'ALL' ? '' : formatStatus(selectedStatusFilter as OrderStatus)} Orders
            </CustomText>
            <CustomText variant="caption" color={Colors.textMuted} style={styles.emptySubtext}>
              {selectedStatusFilter === 'ALL'
                ? 'Orders placed at your restaurants will appear here in real time.'
                : `There are currently no orders in the ${formatStatus(selectedStatusFilter as OrderStatus)} status.`}
            </CustomText>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const statusStyle = getStatusColor(order.status);
            const isUpdating = updatingOrderId === order.id;
            const blocked = isUserBlocked(order.userId);

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Header */}
                <View style={styles.orderCardTop}>
                  <View>
                    <CustomText variant="title" weight="bold" color={Colors.charcoal}>
                      Order #{order.id} • ${Number(order.totalAmount).toFixed(2)}
                    </CustomText>
                    <CustomText variant="caption" color={Colors.textMuted}>
                      {order.restaurant?.name}
                    </CustomText>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <CustomText style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                      {formatStatus(order.status)}
                    </CustomText>
                  </View>
                </View>

                {/* Customer Information (Clean, No Block Button) */}
                <View style={styles.customerRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <User size={14} color={Colors.charcoal} />
                      <CustomText weight="bold" color={Colors.charcoal}>
                        {order.user?.name || 'Customer'}
                      </CustomText>
                      {blocked ? (
                        <View
                          style={{
                            backgroundColor: Colors.errorLight,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <UserX size={10} color={Colors.error} />
                          <CustomText style={{ color: Colors.error, fontSize: 10, fontWeight: '700' }}>
                            Blocked Customer
                          </CustomText>
                        </View>
                      ) : null}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <MapPin size={12} color={Colors.textMuted} />
                      <CustomText variant="caption" color={Colors.textMuted} numberOfLines={1}>
                        {order.deliveryAddress}
                      </CustomText>
                    </View>
                  </View>
                </View>

                {/* Items List */}
                <View style={{ marginVertical: 6 }}>
                  {order.items.map((item) => (
                    <CustomText key={item.id} variant="caption" color={Colors.charcoal}>
                      • {item.quantity}x {item.mealName} (${Number(item.price).toFixed(2)})
                    </CustomText>
                  ))}
                </View>

                {/* Status Progression Actions */}
                {isUpdating ? (
                  <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 10 }} />
                ) : (
                  <View style={styles.statusActionRow}>
                    {order.status === OrderStatus.PLACED && (
                      <>
                        <TouchableOpacity
                          onPress={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
                          style={[styles.statusActionBtn, { backgroundColor: Colors.warning }]}
                          activeOpacity={0.8}
                        >
                          <CustomText style={styles.statusActionBtnText}>Start Preparing</CustomText>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                          style={[styles.statusActionBtn, { backgroundColor: Colors.error }]}
                          activeOpacity={0.8}
                        >
                          <CustomText style={styles.statusActionBtnText}>Cancel Order</CustomText>
                        </TouchableOpacity>
                      </>
                    )}

                    {order.status === OrderStatus.PREPARING && (
                      <TouchableOpacity
                        onPress={() => updateOrderStatus(order.id, OrderStatus.ON_THE_WAY)}
                        style={[styles.statusActionBtn, { backgroundColor: Colors.primary }]}
                        activeOpacity={0.8}
                      >
                        <CustomText style={styles.statusActionBtnText}>Dispatch (On the Way)</CustomText>
                      </TouchableOpacity>
                    )}

                    {order.status === OrderStatus.ON_THE_WAY && (
                      <TouchableOpacity
                        onPress={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)}
                        style={[styles.statusActionBtn, { backgroundColor: Colors.success }]}
                        activeOpacity={0.8}
                      >
                        <CustomText style={styles.statusActionBtnText}>Mark as Delivered</CustomText>
                      </TouchableOpacity>
                    )}

                    {order.status === OrderStatus.DELIVERED && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={15} color={Colors.success} strokeWidth={2.2} />
                        <CustomText variant="caption" color={Colors.success} weight="bold">
                          Delivered
                        </CustomText>
                      </View>
                    )}

                    {order.status === OrderStatus.CANCELLED && (
                      <CustomText variant="caption" color={Colors.error} weight="bold">
                        Order Cancelled
                      </CustomText>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OwnerOrdersScreen;
