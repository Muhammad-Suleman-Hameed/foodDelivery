import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Star, Clock, Truck, Tag, MapPin } from 'lucide-react-native';
import Colors from '../../theme/colors';
import { CustomText } from '../customText';
import { Restaurant } from '../../types/restaurant';
import { styles } from './styles';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
}) => {
  const isFreeDelivery = Number(restaurant.deliveryFee) === 0;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
    >
      {/* Restaurant Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              restaurant.imageUrl ||
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Deal Badge (if present) */}
        {restaurant.dealBadge ? (
          <View style={styles.dealBadge}>
            <Tag size={11} color={Colors.white} style={{ marginRight: 3 }} />
            <CustomText style={styles.dealText}>
              {restaurant.dealBadge}
            </CustomText>
          </View>
        ) : null}

        {/* Delivery Time Pill */}
        <View style={styles.deliveryTimePill}>
          <Clock size={11} color={Colors.charcoal} style={{ marginRight: 3 }} />
          <CustomText style={styles.deliveryTimeText}>
            {restaurant.deliveryTime}
          </CustomText>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Name & Rating */}
        <View style={styles.topRow}>
          <CustomText
            variant="title"
            weight="bold"
            color={Colors.charcoal}
            numberOfLines={1}
            style={styles.name}
          >
            {restaurant.name}
          </CustomText>

          <View style={styles.ratingContainer}>
            <Star size={12} color={Colors.warning} fill={Colors.warning} style={{ marginRight: 3 }} />
            <CustomText
              variant="caption"
              weight="bold"
              color={Colors.charcoal}
              style={styles.ratingText}
            >
              {Number(restaurant.rating).toFixed(1)}
            </CustomText>
          </View>
        </View>

        {/* Cuisine */}
        <CustomText
          variant="caption"
          color={Colors.textMuted}
          numberOfLines={1}
          style={styles.cuisine}
        >
          {restaurant.cuisine}
        </CustomText>

        {/* Footer: Fee & Location */}
        <View style={styles.footerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Truck size={12} color={isFreeDelivery ? Colors.success : Colors.textMuted} />
            <CustomText
              variant="caption"
              color={isFreeDelivery ? Colors.success : Colors.textMuted}
              weight={isFreeDelivery ? '700' : '500'}
              style={[styles.feeText, (isFreeDelivery ? styles.freeFeeText : {}) as any]}
            >
              {isFreeDelivery ? 'Free Delivery' : `Delivery: $${Number(restaurant.deliveryFee).toFixed(2)}`}
            </CustomText>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1, justifyContent: 'flex-end' }}>
            <MapPin size={11} color={Colors.textLight} />
            <CustomText
              variant="caption"
              color={Colors.textLight}
              numberOfLines={1}
              style={styles.locationText}
            >
              {restaurant.address}
            </CustomText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;
