// src/navigation/types.ts
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootTabParamList = {
  Home: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  CanteenMenuScreen: { canteenId: number; canteenName: string };
  ItemDetailsScreen: { itemId: number };
  CartScreen: undefined;
};

export type OrdersStackParamList = {
  OrderHistoryScreen: undefined;
  OrderDetailsScreen: { orderId: number };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
};

// Convenience types
export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;
export type OrderHistoryScreenProps = NativeStackScreenProps<OrdersStackParamList, 'OrderHistoryScreen'>;
export type OrderDetailsScreenProps = NativeStackScreenProps<OrdersStackParamList, 'OrderDetailsScreen'>;
export type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileScreen'>;

export type TabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<RootTabParamList, T>;
