import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { homeService, BackendItem } from '@/services/homeService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency';

type Props = NativeStackScreenProps<HomeStackParamList, 'ItemDetailsScreen'>;

export default function ItemDetailsScreen({ route, navigation }: Props) {
  const { itemId } = route.params;

  const { addItem } = useCart();
  const [item, setItem] = useState<BackendItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let mounted = true;
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await homeService.getItem(itemId);
        if (mounted) {
          if (data) {
            setItem(data);
          } else {
            setError('Item not found');
          }
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load item details');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchItem();
    return () => { mounted = false; };
  }, [itemId]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 py-3 mt-12">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-white/90 rounded-full shadow-sm">
          <MaterialIcons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#006d37" />
        </View>
      ) : error || !item ? (
        <View className="flex-1 justify-center items-center px-4 mt-20">
          <Text className="font-headline-md text-error mb-2">Oops!</Text>
          <Text className="font-body-lg text-on-background text-center">{error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="pb-32" bounces={false}>
          {/* Image */}
          <View className="h-72 w-full bg-surface-container-high relative">
            <Image 
              source={item.image_url ? { uri: item.image_url } : require('../../assets/images/burger.jpg')}
              className="w-full h-full object-cover"
            />
          </View>

          {/* Details */}
          <View className="px-container-margin pt-6 pb-4 bg-background rounded-t-3xl -mt-6 flex-col gap-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4 flex-col gap-2">
                <Text className="font-headline-md text-on-background">{item.item_name}</Text>
                
                {/* Badges Row */}
                <View className="flex-row flex-wrap gap-2 items-center">
                  <StatusBadge 
                    status={item.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                    className={item.is_vegetarian ? 'bg-success text-on-success' : 'bg-error text-on-error'}
                  />
                  {item.category && (
                    <View className="px-2 py-1 bg-surface-container rounded-md">
                      <Text className="font-label-md text-on-surface-variant">{item.category}</Text>
                    </View>
                  )}
                  <View className="px-2 py-1 bg-surface-container rounded-md">
                    <Text className="font-label-md text-on-surface-variant">
                      {item.is_available ? 'Available' : 'Out of Stock'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text className="font-headline-lg text-primary">₹{item.price}</Text>
            </View>

            <View className="w-full h-[1px] bg-outline-variant/30 my-2" />

            <View className="flex-col gap-2">
              <Text className="font-title-md text-on-background">Description</Text>
              <Text className="font-body-md text-on-surface-variant leading-relaxed">
                {item.description || 'No description available for this item.'}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Footer */}
      {!isLoading && !error && item && item.is_available && (
        <View className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest p-4 rounded-t-3xl shadow-lg border-t border-outline-variant/10 flex-row items-center justify-between">
          <View className="flex-row items-center bg-surface-container-high rounded-xl">
            <TouchableOpacity 
              className="p-3 active-scale"
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <MaterialIcons name="remove" size={24} color="#1C1B1F" />
            </TouchableOpacity>
            <Text className="font-title-lg text-on-surface px-4">{quantity}</Text>
            <TouchableOpacity 
              className="p-3 active-scale"
              onPress={() => setQuantity(quantity + 1)}
            >
              <MaterialIcons name="add" size={24} color="#1C1B1F" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            className="flex-1 ml-4 bg-primary p-4 rounded-2xl flex-row justify-center items-center active-scale"
            onPress={() => {
              addItem(item.canteen_id, item, quantity);
              navigation.navigate('CartScreen');
            }}
          >
            <Text className="text-white font-title-md mr-2">Add to Cart</Text>
            <Text className="text-white font-label-lg opacity-80">
              {formatCurrency(parseFloat(item.price) * quantity)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
