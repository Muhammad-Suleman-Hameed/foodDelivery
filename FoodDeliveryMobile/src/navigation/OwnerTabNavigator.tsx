import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Store, ClipboardList, Shield, User } from 'lucide-react-native';
import { OwnerTabParamList } from './types';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import { OwnerRestaurantsScreen } from '../screens/owner/restaurants';
import { OwnerOrdersScreen } from '../screens/owner/orders';
import { OwnerCustomersScreen } from '../screens/owner/customers';
import { OwnerProfileScreen } from '../screens/owner/profile';

const Tab = createBottomTabNavigator<OwnerTabParamList>();

export const OwnerTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 20);
  const tabHeight = 64 + bottomInset;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarLabelStyle: {
          fontSize: Fonts.normalize(11),
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: tabHeight,
          paddingBottom: bottomInset,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="OwnerRestaurantsTab"
        component={OwnerRestaurantsScreen}
        options={{
          tabBarLabel: 'Restaurants',
          tabBarIcon: ({ color }) => <Store size={22} color={color} />,
        }}
      />

      <Tab.Screen
        name="OwnerOrdersTab"
        component={OwnerOrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => <ClipboardList size={22} color={color} />,
        }}
      />

      <Tab.Screen
        name="OwnerCustomersTab"
        component={OwnerCustomersScreen}
        options={{
          tabBarLabel: 'Customers',
          tabBarIcon: ({ color }) => <Shield size={22} color={color} />,
        }}
      />

      <Tab.Screen
        name="OwnerProfileTab"
        component={OwnerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default OwnerTabNavigator;
