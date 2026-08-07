import React, { useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '@/contexts/CartContext';
import { orderService } from '@/services/orderService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import { formatCurrency } from '@/utils/currency';

type Props = NativeStackScreenProps<HomeStackParamList, 'CartScreen'>;

export default function CartScreen({ navigation }: Props) {
  const { items, canteenId, totalPrice, removeItem, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (!canteenId || items.length === 0) return;
    try {
      setIsPlacingOrder(true);
      const itemsMap: Record<number, number> = {};
      items.forEach((item) => {
        itemsMap[item.item_id] = item.cartQuantity;
      });
      await orderService.createOrder(canteenId, itemsMap);
      clearCart();
      Alert.alert('Success', 'Your order has been placed!', [
        { text: 'OK', onPress: () => navigation.navigate('HomeScreen') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="flex-row items-center px-4 py-3 border-b border-outline-variant/20">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
            <MaterialIcons name="arrow-back" size={24} color="#1C1B1F" />
          </TouchableOpacity>
          <Text className="font-title-lg text-on-surface">Your Cart</Text>
        </View>
        <View className="flex-1 justify-center items-center px-4">
          <MaterialIcons name="shopping-cart" size={64} color="#C4C8C5" />
          <Text className="font-headline-sm text-on-surface-variant mt-4">Your cart is empty</Text>
          <TouchableOpacity 
            className="mt-6 bg-primary-container px-6 py-3 rounded-full"
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <Text className="text-on-primary-container font-label-lg">Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-outline-variant/20">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
          <MaterialIcons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>
        <Text className="font-title-lg text-on-surface">Your Cart</Text>
      </View>

      <ScrollView contentContainerClassName="p-4 pb-32">
        {items.map((item) => (
          <View key={item.item_id} className="flex-row items-center bg-surface-container-lowest p-3 rounded-2xl mb-4 shadow-sm border border-outline-variant/10">
            <View className="flex-1 mr-3">
              <Text className="font-title-md text-on-surface" numberOfLines={1}>{item.item_name}</Text>
              <Text className="font-body-md text-on-surface-variant">{formatCurrency(parseFloat(item.price))} x {item.cartQuantity}</Text>
            </View>
            <View className="items-end mr-3">
              <Text className="font-title-md text-primary">{formatCurrency(parseFloat(item.price) * item.cartQuantity)}</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.item_id)} className="p-2 bg-error-container rounded-xl">
              <MaterialIcons name="delete-outline" size={20} color="#8C1D18" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest p-4 rounded-t-3xl shadow-lg border-t border-outline-variant/10">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-title-lg text-on-surface">Total</Text>
          <Text className="font-headline-md text-primary">{formatCurrency(totalPrice)}</Text>
        </View>
        <TouchableOpacity 
          className={`bg-primary p-4 rounded-full items-center flex-row justify-center ${isPlacingOrder ? 'opacity-70' : ''}`}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? (
            <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
          ) : null}
          <Text className="text-white font-title-md">{isPlacingOrder ? 'Placing Order...' : 'Place Order'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
