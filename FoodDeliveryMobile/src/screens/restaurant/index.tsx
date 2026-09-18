import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  Star,
  Clock,
  Truck,
  Tag,
  UtensilsCrossed,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import Colors from '../../theme/colors';
import { CustomText } from '../../components/customText';
import { FoodItemCard } from '../../components/foodItemCard';
import { Restaurant } from '../../types/restaurant';
import { Meal, MealCategory } from '../../types/meal';
import { CartSummary } from '../../types/cart';
import axios from '../../utils/axios';
import { API } from '../../constants/api';
import { styles } from './styles';

type RouteProps = RouteProp<RootStackParamList, 'RestaurantDetail'>;

const MENU_CATEGORIES = [
  { id: 'All', name: 'All' },
  { id: MealCategory.DEALS, name: 'Deals' },
  { id: MealCategory.FAST_FOOD, name: 'Fast Food' },
  { id: MealCategory.DRINKS, name: 'Drinks' },
  { id: MealCategory.DESSERT, name: 'Desserts' },
];

export const RestaurantDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { restaurantId, name } = route.params;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [restaurantData, mealsData, cartData] = await Promise.all([
        axios.get<Restaurant>(API.RESTAURANT_DETAIL(restaurantId)),
        axios.get<Meal[]>(API.RESTAURANT_MEALS(restaurantId)),
        axios.get<CartSummary>(API.CART).catch(() => null),
      ]);
      setRestaurant(restaurantData);
      setMeals(mealsData);
      if (cartData) setCart(cartData);
    } catch (err) {
      console.log('Error loading restaurant menu:', err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const filteredMeals = meals.filter((meal) => {
    if (selectedCategory === 'All') return true;
    return meal.category === selectedCategory;
  });

  const handleAddToCart = async (meal: Meal) => {
    try {
      const updatedCart = await axios.post<CartSummary>(API.CART_ITEMS, {
        mealId: meal.id,
        quantity: 1,
      });
      setCart(updatedCart);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to add item to basket.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Banner Image */}
      <View style={styles.headerBanner}>
        <Image
          source={{
            uri:
              restaurant?.imageUrl ||
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700',
          }}
          style={styles.bannerImage}
          resizeMode="cover"
        />

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color={Colors.charcoal} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      {/* Restaurant Info Summary Card */}
      <View style={styles.restaurantInfoCard}>
        <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.restaurantName}>
          {restaurant?.name || name}
        </CustomText>

        <CustomText variant="caption" color={Colors.textMuted} numberOfLines={1} style={styles.cuisineText}>
          {restaurant?.cuisine || 'Food & Beverages'} • {restaurant?.address}
        </CustomText>

        <View style={styles.badgesRow}>
          <View style={[styles.pill, styles.ratingPill]}>
            <Star size={12} color={Colors.warning} strokeWidth={2.2} style={{ marginRight: 4 }} />
            <CustomText style={styles.pillText}>
              {Number(restaurant?.rating || 4.8).toFixed(1)} ({restaurant?.ratingCount || 50}+)
            </CustomText>
          </View>

          <View style={styles.pill}>
            <Clock size={12} color={Colors.textMuted} strokeWidth={2.2} style={{ marginRight: 4 }} />
            <CustomText style={styles.pillText}>
              {restaurant?.deliveryTime || '20-30 min'}
            </CustomText>
          </View>

          <View style={styles.pill}>
            <Truck size={12} color={Colors.textMuted} strokeWidth={2.2} style={{ marginRight: 4 }} />
            <CustomText style={styles.pillText}>
              ${Number(restaurant?.deliveryFee || 1.49).toFixed(2)} delivery
            </CustomText>
          </View>

          {restaurant?.dealBadge ? (
            <View style={[styles.pill, styles.dealPill]}>
              <Tag size={12} color={Colors.primary} strokeWidth={2.2} style={{ marginRight: 4 }} />
              <CustomText style={[styles.pillText, styles.dealPillText]}>
                {restaurant.dealBadge}
              </CustomText>
            </View>
          ) : null}
        </View>
      </View>

      {/* Menu Categories Carousel */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {MENU_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[styles.categoryTab, (isActive ? styles.activeCategoryTab : {}) as any]}
              >
                <CustomText
                  style={[styles.categoryTabText, (isActive ? styles.activeCategoryTabText : {}) as any]}
                >
                  {cat.name}
                </CustomText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Meals Menu Feed */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredMeals}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={
            <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'Menu' : `${selectedCategory}`} ({filteredMeals.length})
            </CustomText>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <UtensilsCrossed size={36} color={Colors.textMuted} strokeWidth={1.5} style={{ marginBottom: 8 }} />
              <CustomText style={styles.emptyText}>
                No meals found in this section.
              </CustomText>
            </View>
          }
          renderItem={({ item }) => (
            <FoodItemCard
              meal={item}
              onAddToCart={() => handleAddToCart(item)}
            />
          )}
        />
      )}

      {/* Floating Basket Pill */}
      {cart && cart.itemCount > 0 ? (
        <View style={styles.floatingCartBar}>
          <View style={styles.cartInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ShoppingBag size={16} color={Colors.white} strokeWidth={2} style={{ marginRight: 6 }} />
              <CustomText weight="bold" color={Colors.white}>
                {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
              </CustomText>
            </View>
            <CustomText color={Colors.white} variant="caption" style={{ marginTop: 2 }}>
              Total: ${Number(cart.total).toFixed(2)}
            </CustomText>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Cart')}
            style={styles.viewCartButton}
          >
            <CustomText style={styles.viewCartText}>View Basket</CustomText>
            <ArrowRight size={15} color={Colors.primary} strokeWidth={2.4} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default RestaurantDetailScreen;
