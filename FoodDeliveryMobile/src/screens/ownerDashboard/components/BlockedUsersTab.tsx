import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Shield, User, Check, Ban, UserX, ShoppingBag } from 'lucide-react-native';
import Colors from '../../../theme/colors';
import { CustomText } from '../../../components/customText';
import { OwnerCustomer } from '../../../hooks/useOwnerDashboard';
import { styles } from '../styles';

interface BlockedUsersTabProps {
  blockedUsers: any[];
  customers: OwnerCustomer[];
  loading: boolean;
  isUserBlocked: (userId: number) => boolean;
  onBlock: (userId: number, customerName: string) => void;
  onUnblock: (userId: number, customerName?: string) => void;
}

export const BlockedUsersTab: React.FC<BlockedUsersTabProps> = ({
  blockedUsers,
  customers,
  loading,
  isUserBlocked,
  onBlock,
  onUnblock,
}) => {
  return (
    <>
      {/* Section 1: Blocked Customers */}
      <View style={styles.sectionHeader}>
        <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.sectionTitle}>
          Blocked Customers ({blockedUsers.length})
        </CustomText>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
      ) : blockedUsers.length === 0 ? (
        <View style={styles.emptyCard}>
          <Shield size={40} color={Colors.textLight} style={{ marginBottom: 10 }} />
          <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.emptyText}>
            No Blocked Customers
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted} style={styles.emptySubtext}>
            Customers you block will appear here. Blocked customers cannot place orders at any of your restaurants.
          </CustomText>
        </View>
      ) : (
        blockedUsers.map((item) => (
          <View key={item.id} style={styles.restaurantCard}>
            <View style={styles.restaurantHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <User size={15} color={Colors.charcoal} />
                <CustomText variant="title" weight="bold" color={Colors.charcoal}>
                  {item.user?.name || `Customer #${item.userId}`}
                </CustomText>
              </View>

              <TouchableOpacity
                onPress={() => onUnblock(item.userId, item.user?.name)}
                style={[styles.editBtn, { backgroundColor: Colors.successLight, borderColor: Colors.success }]}
                activeOpacity={0.7}
              >
                <Check size={12} color={Colors.success} style={{ marginRight: 3 }} />
                <CustomText style={[styles.editBtnText, { color: Colors.success }]}>
                  Unblock
                </CustomText>
              </TouchableOpacity>
            </View>

            <CustomText variant="caption" color={Colors.textMuted}>
              Email: {item.user?.email || 'N/A'}
            </CustomText>
            {item.reason ? (
              <CustomText variant="caption" color={Colors.error} style={{ marginTop: 4 }}>
                Reason: {item.reason}
              </CustomText>
            ) : null}
          </View>
        ))
      )}

      {/* Section 2: Real Customers Who Ordered (Block/Unblock Controls) */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <View>
          <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.sectionTitle}>
            Recent Customers ({customers.length})
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted}>
            Customers who placed orders. Block or unblock access to your restaurants.
          </CustomText>
        </View>
      </View>

      {customers.length === 0 ? (
        <View style={styles.emptyCard}>
          <ShoppingBag size={40} color={Colors.textLight} style={{ marginBottom: 10 }} />
          <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.emptyText}>
            No Recent Customers
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted} style={styles.emptySubtext}>
            When customers place orders at your restaurants, they will appear here.
          </CustomText>
        </View>
      ) : (
        customers.map((customer) => {
          const blocked = isUserBlocked(customer.id);

          return (
            <View key={customer.id} style={styles.restaurantCard}>
              <View style={styles.restaurantHeader}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <User size={15} color={Colors.charcoal} />
                    <CustomText variant="title" weight="bold" color={Colors.charcoal}>
                      {customer.name}
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
                          Blocked
                        </CustomText>
                      </View>
                    ) : null}
                  </View>

                  <CustomText variant="caption" color={Colors.textMuted} style={{ marginTop: 2 }}>
                    Email: {customer.email} • {customer.orderCount} {customer.orderCount === 1 ? 'order' : 'orders'} placed
                  </CustomText>
                  {customer.address ? (
                    <CustomText variant="caption" color={Colors.textMuted} numberOfLines={1} style={{ marginTop: 1 }}>
                      Address: {customer.address}
                    </CustomText>
                  ) : null}
                </View>

                {blocked ? (
                  <TouchableOpacity
                    onPress={() => onUnblock(customer.id, customer.name)}
                    style={[styles.editBtn, { backgroundColor: Colors.successLight, borderColor: Colors.success }]}
                    activeOpacity={0.7}
                  >
                    <Check size={12} color={Colors.success} style={{ marginRight: 3 }} />
                    <CustomText style={[styles.editBtnText, { color: Colors.success }]}>
                      Unblock
                    </CustomText>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => onBlock(customer.id, customer.name)}
                    style={[styles.deleteBtn, { flexDirection: 'row', alignItems: 'center' }]}
                    activeOpacity={0.7}
                  >
                    <Ban size={12} color={Colors.error} style={{ marginRight: 3 }} />
                    <CustomText style={styles.deleteBtnText}>Block</CustomText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })
      )}
    </>
  );
};

export default BlockedUsersTab;
