import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { orderService, BackendOrder } from '@/services/orderService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrdersStackParamList } from '@/navigation/types';
import { formatCurrency } from '@/utils/currency';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderHistoryScreen'>;

export default function OrderHistoryScreen({ navigation }: Props) {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setError(null);
      const data = await orderService.getUserOrderHistory();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load order history');
    } finally {
      if (!silent) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchOrders(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-success text-on-success';
      case 'cancelled': return 'bg-error text-on-error';
      case 'preparing': return 'bg-tertiary text-on-tertiary';
      default: return 'bg-primary-container text-on-primary-container';
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#006d37" />
      </SafeAreaView>
    );
  }

  if (error && !orders.length) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-4">
        <Text className="font-headline-md text-error mb-2">Oops!</Text>
        <Text className="font-body-lg text-on-background text-center mb-6">{error}</Text>
        <TouchableOpacity 
          className="bg-primary px-6 py-3 rounded-full"
          onPress={() => fetchOrders()}
        >
          <Text className="text-white font-label-lg">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 py-3 border-b border-outline-variant/20 bg-background z-10">
        <Text className="font-headline-sm text-on-surface">Order History</Text>
      </View>

      <ScrollView 
        contentContainerClassName="p-4 pb-32"
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#006d37']} />}
      >
        {orders.length === 0 ? (
          <View className="items-center justify-center mt-12">
            <MaterialIcons name="receipt-long" size={64} color="#C4C8C5" />
            <Text className="font-title-md text-on-surface-variant mt-4">No orders yet</Text>
          </View>
        ) : (
          orders.map((order) => (
            <TouchableOpacity 
              key={order.order_id} 
              className="bg-surface-container-lowest p-4 rounded-2xl mb-4 shadow-sm border border-outline-variant/10 active-scale"
              onPress={() => navigation.navigate('OrderDetailsScreen', { orderId: order.order_id })}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="font-label-lg text-on-surface-variant mb-1">
                    Order #{order.order_id}
                  </Text>
                  <Text className="font-body-sm text-on-surface-variant">
                    {new Date(order.order_time).toLocaleString()}
                  </Text>
                </View>
                <StatusBadge 
                  status={order.status.toUpperCase()} 
                  className={getStatusColor(order.status)}
                />
              </View>
              
              <View className="flex-row flex-wrap gap-2 mb-3">
                {order.items && order.items.slice(0, 3).map((item, idx) => (
                  <View key={idx} className="bg-surface-container px-2 py-1 rounded-md">
                    <Text className="font-label-md text-on-surface">{item.quantity}x {item.item_name}</Text>
                  </View>
                ))}
                {order.items && order.items.length > 3 && (
                  <View className="bg-surface-container px-2 py-1 rounded-md">
                    <Text className="font-label-md text-on-surface">+{order.items.length - 3} more</Text>
                  </View>
                )}
              </View>

              <View className="border-t border-outline-variant/20 pt-3 flex-row justify-between items-center">
                <Text className="font-title-md text-on-surface">Total</Text>
                <Text className="font-title-lg text-primary">{formatCurrency(parseFloat(order.total_price))}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
