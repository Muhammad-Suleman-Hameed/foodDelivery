import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RotateCw, User, MapPin, Package, Ban, UserX, Check, CheckCircle2 } from 'lucide-react-native';
import Colors from '../../../theme/colors';
import { CustomText } from '../../../components/customText';
import { Order, OrderStatus } from '../../../types/order';
import { styles } from '../styles';

interface OrdersTabProps {
  orders: Order[];
  loading: boolean;
  updatingOrderId: number | null;
  isUserBlocked: (userId: number) => boolean;
  onRefresh: () => void;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  loading,
  updatingOrderId,
  isUserBlocked,
  onRefresh,
  onUpdateStatus,
}) => {
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
    <>
      <View style={styles.sectionHeader}>
        <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.sectionTitle}>
          Incoming Orders ({orders.length})
        </CustomText>

        <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn} activeOpacity={0.7}>
          <RotateCw size={14} color={Colors.charcoal} style={{ marginRight: 4 }} />
          <CustomText style={styles.refreshBtnText}>Refresh</CustomText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 30 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyCard}>
          <Package size={44} color={Colors.textLight} style={{ marginBottom: 12 }} />
          <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.emptyText}>
            No Orders Yet
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted} style={styles.emptySubtext}>
            Customer orders placed from your restaurants will show up here in real-time.
          </CustomText>
        </View>
      ) : (
        orders.map((order) => {
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

              {/* Customer Row (Pure Informational) */}
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

              {/* Status Advance Buttons */}
              {isUpdating ? (
                <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 10 }} />
              ) : (
                <View style={styles.statusActionRow}>
                  {order.status === OrderStatus.PLACED && (
                    <>
                      <TouchableOpacity
                        onPress={() => onUpdateStatus(order.id, OrderStatus.PREPARING)}
                        style={[styles.statusActionBtn, { backgroundColor: Colors.warning }]}
                        activeOpacity={0.8}
                      >
                        <CustomText style={styles.statusActionBtnText}>Start Preparing</CustomText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => onUpdateStatus(order.id, OrderStatus.CANCELLED)}
                        style={[styles.statusActionBtn, { backgroundColor: Colors.error }]}
                        activeOpacity={0.8}
                      >
                        <CustomText style={styles.statusActionBtnText}>Cancel Order</CustomText>
                      </TouchableOpacity>
                    </>
                  )}

                  {order.status === OrderStatus.PREPARING && (
                    <TouchableOpacity
                      onPress={() => onUpdateStatus(order.id, OrderStatus.ON_THE_WAY)}
                      style={[styles.statusActionBtn, { backgroundColor: Colors.primary }]}
                      activeOpacity={0.8}
                    >
                      <CustomText style={styles.statusActionBtnText}>Dispatch (On the Way)</CustomText>
                    </TouchableOpacity>
                  )}

                  {order.status === OrderStatus.ON_THE_WAY && (
                    <TouchableOpacity
                      onPress={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)}
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
    </>
  );
};

export default OrdersTab;
