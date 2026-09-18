export type MainTabParamList = {
  HomeTab: undefined;
  CartTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

export type OwnerTabParamList = {
  OwnerRestaurantsTab: undefined;
  OwnerOrdersTab: undefined;
  OwnerCustomersTab: undefined;
  OwnerProfileTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Home: undefined;
  OwnerDashboard: undefined;
  OwnerTabs: undefined;
  RestaurantDetail: { restaurantId: number; name: string };
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: { orderId: number };
};
