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
  
  // Filtering & Sorting State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');

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
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = [...items];
    
    // Category filter
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Veg filter
    if (vegFilter === 'veg') {
      result = result.filter(item => item.is_vegetarian === true);
    } else if (vegFilter === 'non-veg') {
      result = result.filter(item => item.is_vegetarian === false);
    }
    
    // Price sort (default preserves backend ordering)
    if (priceSort === 'asc') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (priceSort === 'desc') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    
    return result;
  }, [items, selectedCategory, vegFilter, priceSort]);

  // Group items by category if no specific category is selected
  const groupedItems = useMemo(() => {
    if (selectedCategory) {
      return { [selectedCategory]: filteredItems };
    }
    const grouped: Record<string, BackendItem[]> = {};
    categories.forEach(cat => {
      grouped[cat] = [];
    });
    // For items that don't have a known category, fallback to 'Other'
    grouped['Other'] = [];
    
    filteredItems.forEach(item => {
      if (item.category && grouped[item.category]) {
        grouped[item.category].push(item);
      } else {
        grouped['Other'].push(item);
      }
    });
    
    // Clean up empty categories
    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 0) {
        delete grouped[key];
      }
    });
    
    return grouped;
  }, [filteredItems, selectedCategory, categories]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setVegFilter('all');
    setPriceSort('none');
  };

  const { items: cartItems } = useCart();
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);

  const isFiltersActive = selectedCategory !== null || vegFilter !== 'all' || priceSort !== 'none';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-outline-variant/20 bg-surface-container-lowest z-10">
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
          <Text className="font-body-lg text-on-background text-center mb-6">{error}</Text>
          <TouchableOpacity 
            className="bg-primary px-6 py-3 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white font-label-lg">Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerClassName="pb-32">
          {/* Controls Bar */}
          <View className="bg-background pt-2 pb-4 shadow-sm z-10">
            {categories.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
                className="mb-3"
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
            )}
            
            <View className="flex-row items-center px-4 justify-between">
              <View className="flex-row gap-2">
                <TouchableOpacity 
                  onPress={() => setVegFilter(prev => prev === 'all' ? 'veg' : prev === 'veg' ? 'non-veg' : 'all')}
                  activeOpacity={0.8}
                >
                  <View className={`px-3 py-1.5 rounded-full border min-h-[44px] justify-center ${vegFilter !== 'all' ? 'border-primary bg-primary-container' : 'border-outline-variant bg-transparent'}`}>
                    <Text className={`font-label-md ${vegFilter !== 'all' ? 'text-on-primary-container' : 'text-on-surface'}`}>
                      {vegFilter === 'all' ? 'Veg/Non-Veg' : vegFilter === 'veg' ? 'Veg Only' : 'Non-Veg Only'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setPriceSort(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none')}
                  activeOpacity={0.8}
                >
                  <View className={`px-3 py-1.5 rounded-full border min-h-[44px] justify-center ${priceSort !== 'none' ? 'border-primary bg-primary-container flex-row items-center gap-1' : 'border-outline-variant bg-transparent flex-row items-center gap-1'}`}>
                    <Text className={`font-label-md ${priceSort !== 'none' ? 'text-on-primary-container' : 'text-on-surface'}`}>
                      Price
                    </Text>
                    {priceSort === 'asc' && <MaterialIcons name="arrow-upward" size={14} color="#006d37" />}
                    {priceSort === 'desc' && <MaterialIcons name="arrow-downward" size={14} color="#006d37" />}
                  </View>
                </TouchableOpacity>
              </View>

              {isFiltersActive && (
                <TouchableOpacity onPress={handleResetFilters} style={{ minHeight: 44, justifyContent: 'center' }}>
                  <Text className="font-label-md text-primary px-2 py-1">Reset</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Menu Items */}
          <View className="px-4 mt-2">
            {items.length === 0 ? (
              <View className="items-center justify-center mt-12">
                <MaterialIcons name="restaurant-menu" size={64} color="#C4C8C5" />
                <Text className="font-body-lg text-on-background-variant mt-4 text-center">
                  No menu items are currently available.
                </Text>
              </View>
            ) : filteredItems.length === 0 ? (
              <View className="items-center justify-center mt-12">
                <MaterialIcons name="search-off" size={64} color="#C4C8C5" />
                <Text className="font-body-lg text-on-background-variant mt-4 text-center">
                  No menu items match the selected filters.
                </Text>
                <TouchableOpacity 
                  className="mt-6 border border-primary px-6 py-3 rounded-full"
                  onPress={handleResetFilters}
                >
                  <Text className="text-primary font-label-lg">Clear Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-col gap-6">
                {Object.keys(groupedItems).sort((a,b) => a.localeCompare(b)).map(category => (
                  <View key={category} className="mb-2">
                    <Text className="font-title-lg text-on-surface mb-3">{category}</Text>
                    <View className="flex-col gap-4">
                      {groupedItems[category].map(item => (
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
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
