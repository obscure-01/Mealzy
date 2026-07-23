// src/screens/Home/HomeScreen.tsx
import React from 'react';
import { View, FlatList, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/home/Header';
import { GreetingSection } from '@/components/home/GreetingSection';
import { SearchBar } from '@/components/home/SearchBar';
import { ActiveOrderCard } from '@/components/common/ActiveOrderCard';
import { CanteenCard } from '@/components/home/CanteenCard';
import { CategoryChip } from '@/components/common/CategoryChip';
import { PopularFoodCard } from '@/components/common/PopularFoodCard';
import { TodaysSpecialCard } from '@/components/common/TodaysSpecialCard';
import { useMockData } from '@/hooks/useMockData';

/** Home screen composed entirely of reusable UI components and mock data. */
export default function HomeScreen() {
  const {
    activeOrder,
    canteens,
    categories,
    popularFoods,
    todaysSpecials,
  } = useMockData();

  // Local state for the search bar
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* 1. & 2. Header and Greeting */}
      <Header avatarSource={require('../../assets/images/avatar.png')}>
        <GreetingSection name="Guest" />
      </Header>

      <ScrollView contentContainerClassName="px-container-margin pt-2 pb-32 space-y-lg" showsVerticalScrollIndicator={false}>
        {/* 3. Search */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* 4. Active Order */}
      {activeOrder &&          <ActiveOrderCard
            token={activeOrder.token}
            status={activeOrder.status}
            readyInMinutes={activeOrder.readyInMinutes}
          />
      }

      {/* 5. Canteen list */}
      <View className="mt-4">
        <View className="flex-row justify-between items-end mb-md">
          <Text className="font-headline-md text-on-background">Choose Your Canteen</Text>
        </View>
        <View className="flex-col gap-md">
          {canteens.map((item, index) => (
            <CanteenCard
              key={item.id}
              image={item.image}
              name={item.name}
              openingHours={item.openHours}
              isOpen={true}
              variant={index % 2 === 0 ? 'primary' : 'secondary'}
            />
          ))}
        </View>
      </View>

      {/* 6. Category chips */}
      <View className="mt-6">
        <Text className="font-headline-md text-on-background mb-4">Popular Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 24 }}
        >
          {categories.map((cat, index) => (
            <CategoryChip key={cat.id} label={cat.name} selected={index === 0} />
          ))}
        </ScrollView>
      </View>

      {/* 7. Popular foods */}
      <View className="mt-8">
        <View className="flex-row justify-between items-end mb-4">
          <Text className="font-headline-md text-on-background">Popular Items</Text>
          <Text className="font-label-lg text-primary">View All</Text>
        </View>
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
              isVeg={index % 2 === 0}
              prepTime={0}
              price={item.price}
            />
          ))}
        </ScrollView>
      </View>

      {/* 8. Today's specials */}
      <View className="mt-8">
        <Text className="font-headline-md text-on-background mb-4">Today's Specials</Text>
        {todaysSpecials.length > 0 && (
          <TodaysSpecialCard
            key={todaysSpecials[0].id}
            image={todaysSpecials[0].image}
            name={todaysSpecials[0].name}
            price={todaysSpecials[0].price}
          />
        )}
      </View>
    </ScrollView>
  </SafeAreaView>
  );
}
