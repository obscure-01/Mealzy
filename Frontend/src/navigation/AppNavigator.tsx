import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootTabParamList, HomeStackParamList } from './types';
import HomeScreen from '@/screens/Home/HomeScreen';
import { AuthNavigator } from './AuthNavigator';
import { useAuth } from '@/contexts/AuthContext';

import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

import CanteenDetailScreen from '@/screens/Home/CanteenDetailScreen';
import CanteenMenuScreen from '@/screens/Home/CanteenMenuScreen';
import ItemDetailsScreen from '@/screens/Home/ItemDetailsScreen';
import CartScreen from '@/screens/Home/CartScreen';
import OrderHistoryScreen from '@/screens/Orders/OrderHistoryScreen';
import OrderDetailsScreen from '@/screens/Orders/OrderDetailsScreen';
import { OrdersStackParamList } from './types';

const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="CanteenDetailScreen" component={CanteenDetailScreen} />
      <HomeStack.Screen name="CanteenMenuScreen" component={CanteenMenuScreen} />
      <HomeStack.Screen name="ItemDetailsScreen" component={ItemDetailsScreen} />
      <HomeStack.Screen name="CartScreen" component={CartScreen} />
    </HomeStack.Navigator>
  );
}

function OrdersStackNavigator() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
      <OrdersStack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
    </OrdersStack.Navigator>
  );
}

import ProfileScreen from '@/screens/Profile/ProfileScreen';
import EditProfileScreen from '@/screens/Profile/EditProfileScreen';
import { ProfileStackParamList } from './types';

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
}

const DummyScreen = () => <View style={{ flex: 1, backgroundColor: '#fdfdfd' }} />;

export function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdfdfd' }}>
        <ActivityIndicator size="large" color="#006d37" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: true,
            tabBarLabel: ({ focused, color }) => {
              return (
                <View className="items-center">
                  <Text className={`font-label-lg mt-1 ${focused ? 'font-bold' : ''}`} style={{ color }}>
                    {route.name}
                  </Text>
                  {focused ? <View className="w-1 h-1 rounded-full bg-primary mt-1" /> : <View className="w-1 h-1 mt-1" />}
                </View>
              );
            },
            tabBarIcon: ({ color, focused }) => {
              let iconName: string = '';
              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Orders') {
                iconName = 'receipt-long';
              } else if (route.name === 'Profile') {
                iconName = 'person';
              }
              return (
                <View className="items-center mt-2">
                  <MaterialIcons name={iconName as any} size={24} color={color} />
                </View>
              );
            },
            tabBarActiveTintColor: '#006d37',
            tabBarInactiveTintColor: '#5d5f5f',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderTopWidth: 0,
              shadowColor: '#2C3E50',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.06,
              shadowRadius: 20,
              elevation: 10,
              height: 70,
              paddingBottom: 10,
              paddingTop: 5,
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeStackNavigator} />
          <Tab.Screen name="Orders" component={OrdersStackNavigator} />
          <Tab.Screen name="Profile" component={ProfileStackNavigator} />
        </Tab.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
