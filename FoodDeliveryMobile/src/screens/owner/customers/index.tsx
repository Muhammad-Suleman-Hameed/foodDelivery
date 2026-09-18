import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Shield,
  User,
  Check,
  Ban,
  UserX,
  RotateCw,
  CheckCircle2,
  Users,
} from 'lucide-react-native';
import Colors from '../../../theme/colors';
import { CustomText } from '../../../components/customText';
import { useOwnerStore, OwnerCustomer } from '../../../store/useOwnerStore';
import { styles } from '../../ownerDashboard/styles';

export const OwnerCustomersScreen: React.FC = () => {
  const {
    blockedUsers,
    blockedLoading,
    fetchBlockedUsers,
    fetchOrders,
    blockUser,
    unblockUser,
    isUserBlocked,
    getCustomers,
  } = useOwnerStore();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'blocked'>('all');

  useEffect(() => {
    fetchBlockedUsers();
    fetchOrders();
  }, [fetchBlockedUsers, fetchOrders]);

  const customers = getCustomers();

  const handleBlockPrompt = (customer: OwnerCustomer) => {
    Alert.alert(
      'Block Customer',
      `Block ${customer.name} from placing orders at any of your restaurants?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block Customer',
          style: 'destructive',
          onPress: async () => {
            await blockUser(customer.id, `Blocked via customer management`);
          },
        },
      ],
    );
  };

  const handleUnblockPrompt = (userId: number, name?: string) => {
    Alert.alert(
      'Unblock Customer',
      `Allow ${name || 'this customer'} to place orders again?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: async () => {
            await unblockUser(userId);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.topBar}>
        <View>
          <CustomText variant="h2" weight="bold" color={Colors.charcoal}>
            Customer Access
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted}>
            Manage customer permissions & blocked users
          </CustomText>
        </View>

        <TouchableOpacity
          onPress={() => {
            fetchBlockedUsers();
            fetchOrders();
          }}
          style={styles.refreshBtn}
          activeOpacity={0.7}
        >
          <RotateCw size={14} color={Colors.charcoal} style={{ marginRight: 4 }} />
          <CustomText style={styles.refreshBtnText}>Refresh</CustomText>
        </TouchableOpacity>
      </View>

      {/* In-Screen Tabs: All Customers vs Blocked Customers */}
      <View style={{ backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border }}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setActiveSubTab('all')}
            style={[
              styles.tabButton,
              (activeSubTab === 'all' ? styles.tabButtonActive : {}) as any,
            ]}
            activeOpacity={0.8}
          >
            <CustomText
              style={[
                styles.tabButtonText,
                (activeSubTab === 'all' ? styles.tabButtonTextActive : {}) as any,
              ]}
            >
              All Customers ({customers.length})
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSubTab('blocked')}
            style={[
              styles.tabButton,
              (activeSubTab === 'blocked' ? styles.tabButtonActive : {}) as any,
            ]}
            activeOpacity={0.8}
          >
            <CustomText
              style={[
                styles.tabButtonText,
                (activeSubTab === 'blocked' ? styles.tabButtonTextActive : {}) as any,
              ]}
            >
              Blocked Customers ({blockedUsers.length})
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tab 1: All Customers */}
        {activeSubTab === 'all' && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.sectionTitle}>
                  Customer Directory ({customers.length})
                </CustomText>
                <CustomText variant="caption" color={Colors.textMuted}>
                  Customers who have ordered from your restaurants, with access controls.
                </CustomText>
              </View>
            </View>

            {customers.length === 0 ? (
              <View style={styles.emptyCard}>
                <Users size={44} color={Colors.textLight} style={{ marginBottom: 12 }} />
                <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.emptyText}>
                  No Customers Yet
                </CustomText>
                <CustomText variant="caption" color={Colors.textMuted} style={styles.emptySubtext}>
                  When customers place orders at your restaurants, they will appear here automatically.
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
                          ) : (
                            <View
                              style={{
                                backgroundColor: Colors.successLight,
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                borderRadius: 4,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 3,
                              }}
                            >
                              <CheckCircle2 size={10} color={Colors.success} />
                              <CustomText style={{ color: Colors.success, fontSize: 10, fontWeight: '700' }}>
                                Active
                              </CustomText>
                            </View>
                          )}
                        </View>

                        <CustomText variant="caption" color={Colors.textMuted} style={{ marginTop: 2 }}>
                          Email: {customer.email} • {customer.orderCount} {customer.orderCount === 1 ? 'order' : 'orders'} placed
                        </CustomText>
                        {customer.phone ? (
                          <CustomText variant="caption" color={Colors.textMuted} style={{ marginTop: 1 }}>
                            Phone: {customer.phone}
                          </CustomText>
                        ) : null}
                        {customer.address ? (
                          <CustomText variant="caption" color={Colors.textMuted} numberOfLines={1} style={{ marginTop: 1 }}>
                            Address: {customer.address}
                          </CustomText>
                        ) : null}
                      </View>

                      {blocked ? (
                        <TouchableOpacity
                          onPress={() => handleUnblockPrompt(customer.id, customer.name)}
                          style={[styles.editBtn, { backgroundColor: Colors.successLight, borderColor: Colors.success, flexDirection: 'row', alignItems: 'center' }]}
                          activeOpacity={0.7}
                        >
                          <Check size={12} color={Colors.success} style={{ marginRight: 3 }} />
                          <CustomText style={[styles.editBtnText, { color: Colors.success }]}>
                            Unblock
                          </CustomText>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleBlockPrompt(customer)}
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
        )}

        {/* Tab 2: Blocked Customers */}
        {activeSubTab === 'blocked' && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.sectionTitle}>
                  Currently Blocked ({blockedUsers.length})
                </CustomText>
                <CustomText variant="caption" color={Colors.textMuted}>
                  Blocked customers cannot order food from any of your restaurants.
                </CustomText>
              </View>
            </View>

            {blockedLoading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 30 }} />
            ) : blockedUsers.length === 0 ? (
              <View style={styles.emptyCard}>
                <Shield size={44} color={Colors.textLight} style={{ marginBottom: 12 }} />
                <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.emptyText}>
                  No Blocked Customers
                </CustomText>
                <CustomText variant="caption" color={Colors.textMuted} style={styles.emptySubtext}>
                  Currently no customers are blocked. You can view all customers in the directory to manage permissions.
                </CustomText>
              </View>
            ) : (
              blockedUsers.map((item) => (
                <View key={item.id} style={styles.restaurantCard}>
                  <View style={styles.restaurantHeader}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <User size={15} color={Colors.charcoal} />
                        <CustomText variant="title" weight="bold" color={Colors.charcoal}>
                          {item.user?.name || `Customer #${item.userId}`}
                        </CustomText>
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
                      </View>

                      <CustomText variant="caption" color={Colors.textMuted} style={{ marginTop: 2 }}>
                        Email: {item.user?.email || 'N/A'}
                      </CustomText>
                      {item.reason ? (
                        <CustomText variant="caption" color={Colors.error} style={{ marginTop: 2 }}>
                          Reason: {item.reason}
                        </CustomText>
                      ) : null}
                    </View>

                    <TouchableOpacity
                      onPress={() => handleUnblockPrompt(item.userId, item.user?.name)}
                      style={[styles.editBtn, { backgroundColor: Colors.successLight, borderColor: Colors.success, flexDirection: 'row', alignItems: 'center' }]}
                      activeOpacity={0.7}
                    >
                      <Check size={12} color={Colors.success} style={{ marginRight: 3 }} />
                      <CustomText style={[styles.editBtnText, { color: Colors.success }]}>
                        Unblock
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OwnerCustomersScreen;
