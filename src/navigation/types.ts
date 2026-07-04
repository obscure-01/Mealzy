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
};

export type OrdersStackParamList = {
  OrdersScreen: undefined;
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
};

// Convenience types
export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;
export type OrdersScreenProps = NativeStackScreenProps<OrdersStackParamList, 'OrdersScreen'>;
export type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileScreen'>;

export type TabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<RootTabParamList, T>;
