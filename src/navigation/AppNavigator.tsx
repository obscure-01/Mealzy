// src/navigation/AppNavigator.tsx
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootTabParamList, HomeStackParamList } from './types';
import HomeScreen from '@/screens/Home/HomeScreen';

import { MaterialIcons } from '@expo/vector-icons';
import colors from '@/theme/colors';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();


function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}





const DummyScreen = () => <View style={{ flex: 1, backgroundColor: '#fdfdfd' }} />;

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelStyle: { fontFamily: 'Outfit-Medium', fontSize: 12 },
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
              <View className="items-center">
                <MaterialIcons name={iconName as any} size={24} color={color} />
                {focused && <View className="w-1 h-1 rounded-full bg-primary mt-1 absolute -bottom-3" />}
              </View>
            );
          },
          tabBarActiveTintColor: '#006d37', // primary color
          tabBarInactiveTintColor: '#5d5f5f', // secondary
          tabBarStyle: { 
            backgroundColor: '#ffffff', // bg-surface-container-lowest
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderTopWidth: 0,
            shadowColor: '#2C3E50',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 20,
            elevation: 10,
            height: 65,
            paddingBottom: 10,
            paddingTop: 10,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Orders" component={DummyScreen} />
        <Tab.Screen name="Profile" component={DummyScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
