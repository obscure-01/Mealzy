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

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: '#fdfdfd', justifyContent: 'center', alignItems: 'center' }}>
      <Text className="font-headline-sm text-on-surface mb-4">Welcome, {user?.name}</Text>
      <TouchableOpacity 
        onPress={logout}
        className="bg-primary px-6 py-3 rounded-2xl"
      >
        <Text className="text-white font-label-lg">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

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
          <Tab.Screen name="Orders" component={DummyScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
