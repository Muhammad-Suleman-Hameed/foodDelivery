import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Store, LogOut } from 'lucide-react-native';
import Colors from '../../theme/colors';
import { CustomText } from '../../components/customText';
import { useAuthStore } from '../../store/useAuthStore';
import { Restaurant } from '../../types/restaurant';
import { useOwnerDashboard } from '../../hooks/useOwnerDashboard';
import { RestaurantsTab } from './components/RestaurantsTab';
import { OrdersTab } from './components/OrdersTab';
import { BlockedUsersTab } from './components/BlockedUsersTab';
import { RestaurantModal } from './components/RestaurantModal';
import { MealsModal } from './components/MealsModal';
import { styles } from './styles';

export const OwnerDashboardScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const {
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
  } = useOwnerDashboard();

  // Modals Visibility
  const [restaurantModalVisible, setRestaurantModalVisible] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [mealsModalVisible, setMealsModalVisible] = useState(false);

  // Restaurant Handlers
  const handleOpenCreate = () => {
    setEditingRestaurant(null);
    setRestaurantModalVisible(true);
  };

  const handleOpenEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setRestaurantModalVisible(true);
  };

  const handleDeleteRestaurant = (id: number, name: string) => {
    Alert.alert('Delete Restaurant', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteRestaurant(id),
      },
    ]);
  };

  // Meals Handlers
  const handleOpenMenu = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    fetchMealsForRestaurant(restaurant.id);
    setMealsModalVisible(true);
  };

  // Customer Blocking Handlers
  const handleBlockCustomerPrompt = (userId: number, customerName: string) => {
    Alert.alert(
      'Block Customer',
      `Are you sure you want to block ${customerName}? They will no longer be able to place orders from any of your restaurants.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block Customer',
          style: 'destructive',
          onPress: () => blockUser(userId, `Blocked via order by owner`),
        },
      ],
    );
  };

  const handleUnblockCustomerPrompt = (userId: number, customerName?: string) => {
    Alert.alert(
      'Unblock Customer',
      `Allow ${customerName || 'this customer'} to place orders again?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: () => unblockUser(userId),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.ownerBadgeContainer}>
          <Store size={22} color={Colors.charcoal} />
          <View>
            <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.ownerTitle}>
              {user?.name || 'Restaurant Owner'}
            </CustomText>
            <View style={styles.badge}>
              <CustomText variant="caption" color={Colors.ownerBadge} weight="bold" style={styles.badgeText}>
                Restaurant Partner
              </CustomText>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={logout} style={styles.logoutPill}>
          <CustomText variant="caption" color={Colors.primary} weight="bold">
            Logout
          </CustomText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.banner}>
          <CustomText variant="h2" weight="bold" color={Colors.white}>
            Partner Portal
          </CustomText>
          <CustomText variant="body" color={Colors.white} style={styles.bannerSubtitle}>
            Manage your restaurants, menu dishes, live kitchen orders, and customer blocking controls.
          </CustomText>
        </View>

        {/* 3 Navigation Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('restaurants')}
            style={[styles.tabButton, (activeTab === 'restaurants' ? styles.tabButtonActive : {}) as any]}
          >
            <CustomText
              style={[
                styles.tabButtonText,
                (activeTab === 'restaurants' ? styles.tabButtonTextActive : {}) as any,
              ]}
            >
              Restaurants ({restaurants.length})
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setActiveTab('orders');
              fetchOwnerOrders();
            }}
            style={[styles.tabButton, (activeTab === 'orders' ? styles.tabButtonActive : {}) as any]}
          >
            <CustomText
              style={[
                styles.tabButtonText,
                (activeTab === 'orders' ? styles.tabButtonTextActive : {}) as any,
              ]}
            >
              Live Orders ({orders.length})
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setActiveTab('blocked');
              fetchBlockedUsers();
            }}
            style={[styles.tabButton, (activeTab === 'blocked' ? styles.tabButtonActive : {}) as any]}
          >
            <CustomText
              style={[
                styles.tabButtonText,
                (activeTab === 'blocked' ? styles.tabButtonTextActive : {}) as any,
              ]}
            >
              Blocked Users
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Restaurants */}
        {activeTab === 'restaurants' && (
          <RestaurantsTab
            restaurants={restaurants}
            loading={restaurantsLoading}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onOpenMenu={handleOpenMenu}
            onDelete={handleDeleteRestaurant}
          />
        )}

        {/* Tab 2: Orders (Live Order Listing Only) */}
        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            loading={ordersLoading}
            updatingOrderId={updatingOrderId}
            isUserBlocked={isUserBlocked}
            onRefresh={fetchOwnerOrders}
            onUpdateStatus={updateOrderStatus}
          />
        )}

        {/* Tab 3: Customer Management & Blocked Users */}
        {activeTab === 'blocked' && (
          <BlockedUsersTab
            blockedUsers={blockedUsers}
            customers={customers}
            loading={blockedLoading}
            isUserBlocked={isUserBlocked}
            onBlock={handleBlockCustomerPrompt}
            onUnblock={handleUnblockCustomerPrompt}
          />
        )}
      </ScrollView>

      {/* Modal: Restaurant Form */}
      <RestaurantModal
        visible={restaurantModalVisible}
        editingRestaurant={editingRestaurant}
        defaultAddress={user?.address || undefined}
        onClose={() => setRestaurantModalVisible(false)}
        onSave={saveRestaurant}
      />

      {/* Modal: Meals Management */}
      <MealsModal
        visible={mealsModalVisible}
        restaurant={selectedRestaurant}
        meals={meals}
        loading={mealsLoading}
        onClose={() => setMealsModalVisible(false)}
        onCreateMeal={createMeal}
        onToggleMeal={toggleMealAvailability}
        onDeleteMeal={deleteMeal}
      />
    </SafeAreaView>
  );
};

export default OwnerDashboardScreen;
