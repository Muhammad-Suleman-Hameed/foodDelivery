import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Plus, Star, Clock, Truck, Utensils, Edit2, Trash2, Store } from 'lucide-react-native';
import Colors from '../../../theme/colors';
import { CustomText } from '../../../components/customText';
import { CustomButton } from '../../../components/customButton';
import { Restaurant } from '../../../types/restaurant';
import { styles } from '../styles';

interface RestaurantsTabProps {
  restaurants: Restaurant[];
  loading: boolean;
  onOpenCreate: () => void;
  onOpenEdit: (restaurant: Restaurant) => void;
  onOpenMenu: (restaurant: Restaurant) => void;
  onDelete: (id: number, name: string) => void;
}

export const RestaurantsTab: React.FC<RestaurantsTabProps> = ({
  restaurants,
  loading,
  onOpenCreate,
  onOpenEdit,
  onOpenMenu,
  onDelete,
}) => {
  return (
    <>
      <View style={styles.sectionHeader}>
        <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.sectionTitle}>
          My Restaurants ({restaurants.length})
        </CustomText>

        <TouchableOpacity onPress={onOpenCreate} style={styles.addButton}>
          <CustomText style={styles.addButtonText}>+ Add Restaurant</CustomText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 30 }} />
      ) : restaurants.length === 0 ? (
        <View style={styles.emptyCard}>
          <Store size={44} color={Colors.textLight} style={{ marginBottom: 12 }} />
          <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.emptyText}>
            No Restaurants Registered
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted} style={styles.emptySubtext}>
            Register your restaurant to start publishing menu items.
          </CustomText>
          <CustomButton title="Add Your First Restaurant" onPress={onOpenCreate} />
        </View>
      ) : (
        restaurants.map((restaurant) => (
          <View key={restaurant.id} style={styles.restaurantCard}>
            <View style={styles.restaurantHeader}>
              <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.restaurantName}>
                {restaurant.name}
              </CustomText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Star size={14} color={Colors.warning} fill={Colors.warning} />
                <CustomText variant="caption" color={Colors.warning} weight="bold">
                  {Number(restaurant.rating).toFixed(1)} ({restaurant.ratingCount})
                </CustomText>
              </View>
            </View>

            <CustomText variant="caption" color={Colors.primary} weight="600" style={styles.cuisineTag}>
              {restaurant.cuisine}
            </CustomText>

            <CustomText variant="caption" color={Colors.textMuted} numberOfLines={1} style={styles.addressText}>
              {restaurant.address}
            </CustomText>

            <View style={styles.statsRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Clock size={13} color={Colors.textMuted} />
                <CustomText variant="caption" color={Colors.textMuted} style={styles.statText}>
                  {restaurant.deliveryTime}
                </CustomText>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Truck size={13} color={Colors.textMuted} />
                <CustomText variant="caption" color={Colors.textMuted} style={styles.statText}>
                  Fee: ${Number(restaurant.deliveryFee).toFixed(2)}
                </CustomText>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => onOpenMenu(restaurant)} style={styles.menuBtn}>
                <Utensils size={14} color={Colors.primary} style={{ marginRight: 4 }} />
                <CustomText style={styles.menuBtnText}>Manage Meals</CustomText>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onOpenEdit(restaurant)} style={styles.editBtn}>
                <Edit2 size={13} color={Colors.charcoal} style={{ marginRight: 4 }} />
                <CustomText style={styles.editBtnText}>Edit</CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onDelete(restaurant.id, restaurant.name)}
                style={styles.deleteBtn}
              >
                <Trash2 size={13} color={Colors.error} style={{ marginRight: 4 }} />
                <CustomText style={styles.deleteBtnText}>Delete</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </>
  );
};

export default RestaurantsTab;
