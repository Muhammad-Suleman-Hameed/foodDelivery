import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../constants/globalConstants';
import { LoginScreen } from '../screens/auth/login';
import { RegisterScreen } from '../screens/auth/signUp';
import { HomeScreen } from '../screens/home';
import { RestaurantDetailScreen } from '../screens/restaurant';
import { CartScreen } from '../screens/cart';
import { CheckoutScreen } from '../screens/checkout';
import { OrderTrackingScreen } from '../screens/orderTracking';

import { MainTabNavigator } from './MainTabNavigator';
import { OwnerTabNavigator } from './OwnerTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const isOwner = user?.role === UserRole.RESTAURANT_OWNER;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : isOwner ? (
          // Restaurant Owner Stack with Bottom Tabs
          <>
            <Stack.Screen name="OwnerTabs" component={OwnerTabNavigator} />
            <Stack.Screen name="OwnerDashboard" component={OwnerTabNavigator} />
            <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
          </>
        ) : (
          // Regular User / Customer Stack with Bottom Tabs
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="Home" component={MainTabNavigator} />
            <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
