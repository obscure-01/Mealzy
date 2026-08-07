import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { homeService, BackendItem } from '@/services/homeService';
import { PopularFoodCard } from '@/components/common/PopularFoodCard';
import { CategoryChip } from '@/components/common/CategoryChip';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import { useCart } from '@/contexts/CartContext';

type Props = NativeStackScreenProps<HomeStackParamList, 'CanteenMenuScreen'>;

export default function CanteenMenuScreen({ route, navigation }: Props) {
  const { canteenId, canteenName } = route.params;

  const [items, setItems] = useState<BackendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await homeService.getAvailableMenu(canteenId);
        if (mounted) setItems(data);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load menu');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchMenu();
    return () => { mounted = false; };
  }, [canteenId]);

  const categories = useMemo(() => {
    const unique = new Set(items.map(item => item.category).filter(Boolean));
    return Array.from(unique);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return items;
    return items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const { items: cartItems } = useCart();
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-outline-variant/20">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
          <MaterialIcons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>
        <Text className="font-title-lg text-on-surface flex-1">{canteenName}</Text>
        <TouchableOpacity 
          className="p-2 relative"
          onPress={() => navigation.navigate('CartScreen')}
        >
          <MaterialIcons name="shopping-cart" size={28} color="#1C1B1F" />
          {cartItemCount > 0 && (
            <View className="absolute top-0 right-0 bg-error w-5 h-5 rounded-full items-center justify-center border-2 border-background z-10">
              <Text className="text-white text-[10px] font-bold">{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#006d37" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="font-headline-md text-error mb-2">Oops!</Text>
          <Text className="font-body-lg text-on-background text-center">{error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="pb-32">
          {/* Categories */}
          {categories.length > 0 && (
            <View className="py-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
              >
                <CategoryChip
                  label="All"
                  selected={selectedCategory === null}
                  onPress={() => setSelectedCategory(null)}
                />
                {categories.map((cat, index) => (
                  <CategoryChip
                    key={index.toString()}
                    label={cat}
                    selected={selectedCategory === cat}
                    onPress={() => setSelectedCategory(cat)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Menu Items */}
          <View className="px-4 mt-2">
            {filteredItems.length === 0 ? (
              <Text className="font-body-md text-on-background-variant mt-4 text-center">
                No menu items available.
              </Text>
            ) : (
              <View className="flex-col gap-4">
                {filteredItems.map(item => (
                  <PopularFoodCard
                    key={item.item_id}
                    image={item.image_url ? { uri: item.image_url } : require('../../assets/images/burger.jpg')}
                    name={item.item_name}
                    description={item.description || item.item_name}
                    isVeg={item.is_vegetarian}
                    prepTime={0}
                    price={parseFloat(item.price)}
                    onPress={() => navigation.navigate('ItemDetailsScreen', { itemId: item.item_id })}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
