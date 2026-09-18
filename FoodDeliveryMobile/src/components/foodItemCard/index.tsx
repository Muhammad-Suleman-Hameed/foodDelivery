import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import Colors from '../../theme/colors';
import { CustomText } from '../customText';
import { Meal } from '../../types/meal';
import { styles } from './styles';

interface FoodItemCardProps {
  meal: Meal;
  onAddToCart?: () => void;
  onPress?: () => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  meal,
  onAddToCart,
  onPress,
}) => {
  const isAvailable = meal.isAvailable !== false;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!onPress}
      style={styles.card}
    >
      {/* Left Details */}
      <View style={styles.leftContent}>
        {/* Category Tag */}
        <View style={styles.categoryBadge}>
          <CustomText style={styles.categoryText}>
            {meal.category}
          </CustomText>
        </View>

        {/* Title */}
        <CustomText
          variant="title"
          weight="bold"
          color={Colors.charcoal}
          numberOfLines={2}
          style={styles.title}
        >
          {meal.name}
        </CustomText>

        {/* Description */}
        {meal.description ? (
          <CustomText
            variant="caption"
            color={Colors.textMuted}
            numberOfLines={2}
            style={styles.description}
          >
            {meal.description}
          </CustomText>
        ) : null}

        {/* Price & Status */}
        <View style={styles.priceRow}>
          <CustomText
            variant="title"
            weight="bold"
            color={Colors.primary}
            style={styles.price}
          >
            ${Number(meal.price).toFixed(2)}
          </CustomText>

          {!isAvailable ? (
            <View style={styles.soldOutTag}>
              <CustomText style={styles.soldOutText}>Sold Out</CustomText>
            </View>
          ) : null}
        </View>
      </View>

      {/* Right Image + Quick Add Button */}
      <View style={styles.rightContent}>
        <Image
          source={{
            uri:
              meal.imageUrl ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {isAvailable && onAddToCart ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAddToCart}
            style={styles.addButton}
          >
            <Plus size={16} color={Colors.white} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default FoodItemCard;
