import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  ShoppingBag,
  Store,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import Colors from '../../theme/colors';
import { CustomText } from '../../components/customText';
import { CustomButton } from '../../components/customButton';
import { CartItem } from '../../types/cart';
import { useCart } from '../../hooks/useCart';
import { styles } from './styles';

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { cart, loading, updatingId, updateQuantity, clearCart } = useCart();

  const handleUpdateQuantity = async (item: CartItem, newQty: number) => {
    try {
      await updateQuantity(item, newQty);
    } catch {
      // Alert already handled in useCart
    }
  };

  const handleClearCart = () => {
    Alert.alert('Clear Basket', 'Are you sure you want to remove all items from your basket?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearCart();
          } catch {
            // Handled in hook
          }
        },
      },
    ]);
  };

  const hasItems = Boolean(cart && cart.items && cart.items.length > 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        {navigation.canGoBack() ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={Colors.charcoal} strokeWidth={2.2} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}

        <View style={styles.headerTitleContainer}>
          <CustomText variant="title" weight="bold" color={Colors.charcoal}>
            Your Basket
          </CustomText>
          {hasItems && cart ? (
            <CustomText variant="caption" color={Colors.textMuted}>
              {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
            </CustomText>
          ) : null}
        </View>

        {hasItems ? (
          <TouchableOpacity onPress={handleClearCart} activeOpacity={0.7} style={{ padding: 4 }}>
            <Trash2 size={18} color={Colors.error} strokeWidth={2} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {loading && !cart ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : !hasItems ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={52} color={Colors.textMuted} strokeWidth={1.4} style={{ marginBottom: 12 }} />
          <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.emptyTitle}>
            Your Basket is Empty
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted} style={styles.emptyDesc}>
            Explore restaurants and menus to add your favorite meals.
          </CustomText>
          <View style={{ marginTop: 24, width: '60%' }}>
            <CustomButton
              title="Explore Restaurants"
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        </View>
      ) : cart ? (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Restaurant Info Pill */}
            {cart.restaurant ? (
              <View style={styles.restaurantCard}>
                <View style={{ marginRight: 12 }}>
                  <Store size={22} color={Colors.primary} strokeWidth={2} />
                </View>
                <View style={styles.restaurantInfo}>
                  <CustomText variant="title" weight="bold" color={Colors.charcoal}>
                    {cart.restaurant.name}
                  </CustomText>
                  <CustomText variant="caption" color={Colors.textMuted} numberOfLines={1}>
                    {cart.restaurant.address}
                  </CustomText>
                </View>
              </View>
            ) : null}

            {/* Cart Items List */}
            <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.sectionTitle}>
              Order Items
            </CustomText>

            {cart.items.map((item) => (
              <View key={item.id} style={styles.cartItemCard}>
                <View style={styles.itemLeft}>
                  <CustomText weight="bold" color={Colors.charcoal} numberOfLines={1} style={styles.itemName}>
                    {item.meal?.name || 'Meal Item'}
                  </CustomText>
                  <CustomText weight="bold" color={Colors.primary} style={styles.itemPrice}>
                    ${Number(item.meal?.price || 0).toFixed(2)}
                  </CustomText>
                </View>

                {/* Stepper (+ / -) */}
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
                    disabled={updatingId === item.id}
                    style={styles.stepperButton}
                    activeOpacity={0.7}
                  >
                    <Minus size={14} color={Colors.primary} strokeWidth={2.5} />
                  </TouchableOpacity>

                  {updatingId === item.id ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <CustomText style={styles.quantityText}>
                      {item.quantity}
                    </CustomText>
                  )}

                  <TouchableOpacity
                    onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
                    disabled={updatingId === item.id}
                    style={styles.stepperButton}
                    activeOpacity={0.7}
                  >
                    <Plus size={14} color={Colors.primary} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Price Summary */}
            <View style={styles.summaryCard}>
              <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.summaryTitle}>
                Bill Summary
              </CustomText>

              <View style={styles.summaryRow}>
                <CustomText color={Colors.textMuted}>Subtotal</CustomText>
                <CustomText weight="bold" color={Colors.charcoal}>
                  ${Number(cart.subtotal).toFixed(2)}
                </CustomText>
              </View>

              <View style={styles.summaryRow}>
                <CustomText color={Colors.textMuted}>Delivery Fee</CustomText>
                <CustomText weight="bold" color={Colors.charcoal}>
                  ${Number(cart.deliveryFee).toFixed(2)}
                </CustomText>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <CustomText variant="title" weight="bold" color={Colors.charcoal}>
                  Total
                </CustomText>
                <CustomText variant="title" weight="bold" color={Colors.primary}>
                  ${Number(cart.total).toFixed(2)}
                </CustomText>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Checkout CTA */}
          <View style={styles.bottomBar}>
            <CustomButton
              title={`Proceed to Checkout • $${Number(cart.total).toFixed(2)}`}
              onPress={() => navigation.navigate('Checkout')}
            />
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default CartScreen;
