import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  Banknote,
  FileText,
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import Colors from '../../theme/colors';
import { CustomText } from '../../components/customText';
import { CustomButton } from '../../components/customButton';
import { Input } from '../../components/input';
import { useAuthStore } from '../../store/useAuthStore';
import { CartSummary } from '../../types/cart';
import { PaymentMethod, Order } from '../../types/order';
import axios from '../../utils/axios';
import { API } from '../../constants/api';
import { styles } from './styles';

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((state) => state.user);

  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH_ON_DELIVERY);
  const [notes, setNotes] = useState('');
  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await axios.get<CartSummary>(API.CART);
        setCart(data);
      } catch (err) {
        console.log('Error fetching checkout cart:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setAddressError('Please provide a delivery address');
      return;
    }

    try {
      setPlacingOrder(true);
      setAddressError(null);

      const orderData = await axios.post<Order>(API.ORDERS, {
        deliveryAddress: address.trim(),
        paymentMethod,
        notes: notes.trim() || undefined,
      });

      // Order placed successfully! Navigate directly to Live Order Tracking
      navigation.replace('OrderTracking', { orderId: orderData.id });
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || 'Failed to place order.';

      if (status === 403) {
        // Owner User-Blocking triggered
        Alert.alert(
          'Order Blocked',
          msg || 'You have been blocked by this restaurant owner from ordering.',
          [{ text: 'OK', onPress: () => navigation.navigate('MainTabs') }],
        );
      } else {
        Alert.alert('Order Failed', Array.isArray(msg) ? msg[0] : msg);
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={Colors.charcoal} strokeWidth={2.2} />
        </TouchableOpacity>

        <CustomText variant="title" weight="bold" color={Colors.charcoal}>
          Checkout
        </CustomText>

        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Delivery Address Card */}
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <MapPin size={18} color={Colors.primary} strokeWidth={2.2} style={{ marginRight: 6 }} />
                <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.cardTitle}>
                  Delivery Address
                </CustomText>
              </View>
              <Input
                label="Delivery Address"
                placeholder="Enter delivery address"
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  setAddressError(null);
                }}
                error={addressError || undefined}
              />
            </View>

            {/* Payment Method Selector Card */}
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <CreditCard size={18} color={Colors.primary} strokeWidth={2.2} style={{ marginRight: 6 }} />
                <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.cardTitle}>
                  Payment Method
                </CustomText>
              </View>

              {/* Cash on Delivery */}
              <TouchableOpacity
                onPress={() => setPaymentMethod(PaymentMethod.CASH_ON_DELIVERY)}
                style={[
                  styles.paymentOption,
                  paymentMethod === PaymentMethod.CASH_ON_DELIVERY && styles.paymentOptionActive,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.paymentLeft}>
                  <Banknote size={20} color={Colors.charcoal} strokeWidth={2} />
                  <View>
                    <CustomText weight="bold" color={Colors.charcoal}>
                      Cash on Delivery
                    </CustomText>
                    <CustomText variant="caption" color={Colors.textMuted}>
                      Pay upon delivery
                    </CustomText>
                  </View>
                </View>

                <View
                  style={[
                    styles.radioCircle,
                    paymentMethod === PaymentMethod.CASH_ON_DELIVERY && styles.radioCircleActive,
                  ]}
                >
                  {paymentMethod === PaymentMethod.CASH_ON_DELIVERY ? (
                    <View style={styles.radioInner} />
                  ) : null}
                </View>
              </TouchableOpacity>

              {/* Card / Online */}
              <TouchableOpacity
                onPress={() => setPaymentMethod(PaymentMethod.CARD)}
                style={[
                  styles.paymentOption,
                  paymentMethod === PaymentMethod.CARD && styles.paymentOptionActive,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.paymentLeft}>
                  <CreditCard size={20} color={Colors.charcoal} strokeWidth={2} />
                  <View>
                    <CustomText weight="bold" color={Colors.charcoal}>
                      Card Payment
                    </CustomText>
                    <CustomText variant="caption" color={Colors.textMuted}>
                      Credit or debit card
                    </CustomText>
                  </View>
                </View>

                <View
                  style={[
                    styles.radioCircle,
                    paymentMethod === PaymentMethod.CARD && styles.radioCircleActive,
                  ]}
                >
                  {paymentMethod === PaymentMethod.CARD ? (
                    <View style={styles.radioInner} />
                  ) : null}
                </View>
              </TouchableOpacity>
            </View>

            {/* Courier Instructions */}
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <FileText size={18} color={Colors.primary} strokeWidth={2.2} style={{ marginRight: 6 }} />
                <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.cardTitle}>
                  Instructions (Optional)
                </CustomText>
              </View>
              <Input
                placeholder="Notes for courier"
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* Order Bill Summary */}
            {cart ? (
              <View style={styles.card}>
                <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.cardTitle}>
                  Summary ({cart.restaurant?.name || 'Restaurant'})
                </CustomText>

                <View style={styles.summaryRow}>
                  <CustomText color={Colors.textMuted}>Subtotal ({cart.itemCount} items)</CustomText>
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
            ) : null}
          </ScrollView>

          {/* Bottom CTA */}
          <View style={styles.bottomBar}>
            <CustomButton
              title="Place Order"
              loading={placingOrder}
              disabled={placingOrder}
              onPress={handlePlaceOrder}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default CheckoutScreen;
