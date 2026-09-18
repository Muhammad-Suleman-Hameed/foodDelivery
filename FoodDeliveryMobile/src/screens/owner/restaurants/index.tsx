import React, { useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../../theme/colors';
import { CustomText } from '../../../components/customText';
import { useAuthStore } from '../../../store/useAuthStore';
import { useOwnerStore } from '../../../store/useOwnerStore';
import { RestaurantsTab } from '../../ownerDashboard/components/RestaurantsTab';
import { RestaurantModal } from '../../ownerDashboard/components/RestaurantModal';
import { MealsModal } from '../../ownerDashboard/components/MealsModal';
import { Restaurant } from '../../../types/restaurant';
import { styles } from '../../ownerDashboard/styles';

export const OwnerRestaurantsScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const {
    restaurants,
    restaurantsLoading,
    selectedRestaurant,
    meals,
    mealsLoading,
    restaurantModalVisible,
    editingRestaurant,
    mealsModalVisible,
    fetchRestaurants,
    fetchMeals,
    setRestaurantModalVisible,
    setEditingRestaurant,
    setMealsModalVisible,
    setSelectedRestaurant,
    saveRestaurant,
    deleteRestaurant,
    createMeal,
    toggleMealAvailability,
    deleteMeal,
  } = useOwnerStore();

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleOpenCreate = () => {
    setEditingRestaurant(null);
    setRestaurantModalVisible(true);
  };

  const handleOpenEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setRestaurantModalVisible(true);
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert('Delete Restaurant', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteRestaurant(id),
      },
    ]);
  };

  const handleOpenMenu = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    fetchMeals(restaurant.id);
    setMealsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.topBar}>
        <View>
          <CustomText variant="h2" weight="bold" color={Colors.charcoal}>
            Restaurants
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted}>
            Manage your restaurant locations & menus
          </CustomText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <RestaurantsTab
          restaurants={restaurants}
          loading={restaurantsLoading}
          onOpenCreate={handleOpenCreate}
          onOpenEdit={handleOpenEdit}
          onOpenMenu={handleOpenMenu}
          onDelete={handleDelete}
        />
      </ScrollView>

      {/* Modal: Add/Edit Restaurant Form */}
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

export default OwnerRestaurantsScreen;
