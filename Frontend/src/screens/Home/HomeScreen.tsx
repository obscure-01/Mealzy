// src/screens/Home/HomeScreen.tsx
import React from 'react';
import { View, FlatList, ScrollView, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/home/Header';
import { GreetingSection } from '@/components/home/GreetingSection';
import { SearchBar } from '@/components/home/SearchBar';
import { ActiveOrderCard } from '@/components/common/ActiveOrderCard';
import { CanteenCard } from '@/components/home/CanteenCard';
import { CategoryChip } from '@/components/common/CategoryChip';
import { PopularFoodCard } from '@/components/common/PopularFoodCard';
import { TodaysSpecialCard } from '@/components/common/TodaysSpecialCard';
import { useHomeData } from '@/hooks/useHomeData';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import { MaterialIcons } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

/** Home screen composed entirely of reusable UI components and backend data. */
export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const { items } = useCart();
  const cartItemCount = items.reduce((acc, item) => acc + item.cartQuantity, 0);

  const {
    activeOrder,
    canteens,
    categories,
    foods, // all foods available
    popularFoods,
    todaysSpecials,
    isLoading,
    error,
    retry,
  } = useHomeData();

  // Local state for the search bar
  const [searchQuery, setSearchQuery] = React.useState('');

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#FF8A00" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-4">
        <Text className="font-headline-md text-error mb-2">Oops!</Text>
        <Text className="font-body-lg text-on-background text-center mb-6">{error}</Text>
        <TouchableOpacity 
          className="bg-primary px-6 py-3 rounded-full"
          onPress={retry}
        >
          <Text className="text-white font-label-lg">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* 1. & 2. Header and Greeting */}
      <Header 
        avatarSource={require('../../assets/images/avatar.png')}
        rightAction={
          <TouchableOpacity 
            style={{ padding: 8, position: 'relative' }}
            onPress={() => navigation.navigate('CartScreen')}
          >
            <MaterialIcons name="shopping-cart" size={28} color="#1C1B1F" />
            {cartItemCount > 0 && (
              <View className="absolute top-0 right-0 bg-error w-5 h-5 rounded-full items-center justify-center border-2 border-background z-10">
                <Text className="text-white text-[10px] font-bold">{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      >
        <GreetingSection name={user?.name || 'Guest'} />
      </Header>

      <ScrollView contentContainerClassName="px-container-margin pt-2 pb-32 flex-col gap-lg" showsVerticalScrollIndicator={false}>
        {/* 3. Search */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* 4. Active Order */}
        {activeOrder && <ActiveOrderCard
          token={activeOrder.token}
          status={activeOrder.status}
          readyInMinutes={activeOrder.readyInMinutes}
          onPress={() => navigation.navigate('Orders' as any, { 
            screen: 'OrderDetailsScreen', 
            params: { orderId: parseInt(activeOrder.token, 10) } 
          } as any)}
        />
        }

        {/* 5. Canteen list */}
        <View>
          <View className="flex-row justify-between items-end mb-md">
            <Text className="font-headline-md text-on-background">Choose Your Canteen</Text>
          </View>
          {canteens.length === 0 ? (
            <Text className="font-body-md text-on-background-variant mt-2">
              No canteens available at the moment.
            </Text>
          ) : (
            <View className="flex-col gap-md">
              {canteens.map((item, index) => (
                <CanteenCard
                  key={item.id}
                  image={item.image}
                  name={item.name}
                  openingHours={item.openHours}
                  isOpen={(item as any).isOpen ?? true}
                  variant={index % 2 === 0 ? 'primary' : 'secondary'}
                  onPress={() => navigation.navigate('CanteenDetailScreen', { canteenId: parseInt(item.id, 10), canteenName: item.name })}
                />
              ))}
            </View>
          )}
        </View>

        {/* 6. Category chips */}
        <View>
          <Text className="font-headline-md text-on-background mb-md">Popular Categories</Text>
          {categories.length === 0 ? (
            <Text className="font-body-md text-on-background-variant">
              No categories found.
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingRight: 24 }}
            >
              {categories.map((cat, index) => (
                <CategoryChip key={cat.id} label={cat.name} selected={index === 0} />
              ))}
            </ScrollView>
          )}
        </View>

        {/* 7. Popular foods */}
        <View>
          <View className="flex-row justify-between items-center mb-md">
            <Text className="font-headline-md text-on-background">Popular Items</Text>
            {popularFoods.length > 0 && <Text className="font-label-lg text-primary">View All</Text>}
          </View>
          {popularFoods.length === 0 ? (
            <Text className="font-body-md text-on-background-variant">
              No popular items available.
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16, paddingRight: 24 }}
            >
              {popularFoods.map((item, index) => (
                <PopularFoodCard
                  key={item.id}
                  image={item.image}
                  name={item.name}
                  description={item.name}
                  isVeg={(item as any).isVegetarian ?? index % 2 === 0}
                  prepTime={0}
                  price={item.price}
                  onPress={() => navigation.navigate('ItemDetailsScreen', { itemId: parseInt(item.id, 10) })}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* 8. Today's specials */}
        <View className="mt-8">
          <Text className="font-headline-md text-on-background mb-4">Today's Specials</Text>
          {todaysSpecials.length > 0 ? (
            <TodaysSpecialCard
              key={todaysSpecials[0].id}
              image={todaysSpecials[0].image}
              name={todaysSpecials[0].name}
              price={todaysSpecials[0].price}
              onPress={() => navigation.navigate('ItemDetailsScreen', { itemId: parseInt(todaysSpecials[0].id, 10) })}
            />
          ) : (
            <Text className="font-body-md text-on-background-variant">
              No specials today.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
