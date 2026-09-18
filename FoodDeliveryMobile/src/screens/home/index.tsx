import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, MapPin, Utensils } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import Colors from '../../theme/colors';
import { CustomText } from '../../components/customText';
import { RestaurantCard } from '../../components/restaurantCard';
import { useAuthStore } from '../../store/useAuthStore';
import { Restaurant } from '../../types/restaurant';
import axios from '../../utils/axios';
import { API } from '../../constants/api';
import { styles } from './styles';

const CATEGORIES = [
  { id: 'All', name: 'All Cuisines' },
  { id: 'Fast Food', name: 'Fast Food' },
  { id: 'Drinks', name: 'Drinks & Cafe' },
  { id: 'Deals', name: 'Deals & Offers' },
  { id: 'Dessert', name: 'Desserts' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((state) => state.user);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRestaurants = useCallback(async (cuisine?: string, search?: string) => {
    try {
      const params: Record<string, string> = {};
      if (cuisine && cuisine !== 'All') params.cuisine = cuisine;
      if (search && search.trim()) params.search = search.trim();

      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `${API.RESTAURANTS}${queryParams ? `?${queryParams}` : ''}`;

      const data = await axios.get<Restaurant[]>(endpoint);
      setRestaurants(data);
    } catch (err) {
      console.log('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants(selectedCategory, searchQuery);
  }, [fetchRestaurants, selectedCategory, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurants(selectedCategory, searchQuery);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    fetchRestaurants(categoryId, searchQuery);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Location Bar */}
      <View style={styles.topBar}>
        <View style={styles.locationContainer}>
          <CustomText variant="caption" color={Colors.textMuted} weight="600" style={styles.deliverToLabel}>
            DELIVERING TO
          </CustomText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MapPin size={14} color={Colors.primary} />
            <CustomText variant="title" weight="bold" color={Colors.charcoal} numberOfLines={1} style={styles.locationText}>
              {user?.address || 'Islamabad, Pakistan'}
            </CustomText>
          </View>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={16} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            placeholder="Search restaurants or dishes"
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Category Chips Carousel */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleSelectCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  (isActive ? styles.activeCategoryChip : {}) as any,
                ]}
              >
                <CustomText
                  style={[
                    styles.categoryText,
                    (isActive ? styles.activeCategoryText : {}) as any,
                  ]}
                >
                  {cat.name}
                </CustomText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Restaurant Feed */}
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.feedHeader}>
            <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.feedTitle}>
              {selectedCategory === 'All' ? 'All Restaurants' : `${selectedCategory} Nearby`}
            </CustomText>
            <CustomText variant="caption" color={Colors.textMuted} style={styles.feedCount}>
              {restaurants.length} {restaurants.length === 1 ? 'place' : 'places'} available
            </CustomText>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Utensils size={36} color={Colors.textLight} style={{ marginBottom: 10 }} />
              <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.emptyTitle}>
                No Restaurants Found
              </CustomText>
              <CustomText variant="caption" color={Colors.textMuted} style={styles.emptyDesc}>
                Try selecting a different cuisine or clearing your search.
              </CustomText>
            </View>
          )
        }
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            onPress={() =>
              navigation.navigate('RestaurantDetail', {
                restaurantId: item.id,
                name: item.name,
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
