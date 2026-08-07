import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { orderService, OrderDetailsResponse } from '@/services/orderService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrdersStackParamList } from '@/navigation/types';
import { formatCurrency } from '@/utils/currency';
import { StatusBadge } from '@/components/common/StatusBadge';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderDetailsScreen'>;

export default function OrderDetailsScreen({ route, navigation }: Props) {
  const { orderId } = route.params;

  const [orderData, setOrderData] = useState<OrderDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setError(null);
      const data = await orderService.getUserOrder(orderId);
      if (data) {
        setOrderData(data);
      } else {
        setError('Order not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load order details');
    } finally {
      if (!silent) setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [orderId]);

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchOrderDetails();
    return () => { mounted = false; };
  }, [fetchOrderDetails]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchOrderDetails(true);
  };

  const handleCancelOrder = async () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No, Keep it', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsCancelling(true);
              await orderService.cancelOrderUser(orderId);
              Alert.alert('Success', 'Order cancelled successfully');
              fetchOrderDetails(true); // Refresh silently
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to cancel order');
            } finally {
              setIsCancelling(false);
            }
          }
        }
      ]
    );
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

  if (error || !orderData) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-4">
        <Text className="font-headline-md text-error mb-2">Oops!</Text>
        <Text className="font-body-lg text-on-background text-center mb-6">{error}</Text>
        <TouchableOpacity 
          className="bg-primary px-6 py-3 rounded-full"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-label-lg">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { info, items } = orderData;
  const isCancellable = info.status.toLowerCase() === 'pending';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-outline-variant/20 bg-background z-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
          <MaterialIcons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>
        <Text className="font-title-lg text-on-surface flex-1 text-center pr-10">Order #{info.order_id}</Text>
      </View>

      <ScrollView 
        contentContainerClassName="p-4 pb-32"
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#006d37']} />}
      >
        {/* Status Card */}
        <View className="bg-surface-container-lowest p-4 rounded-2xl mb-4 shadow-sm border border-outline-variant/10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-title-md text-on-surface">Status</Text>
            <StatusBadge 
              status={info.status.toUpperCase()} 
              className={getStatusColor(info.status)}
            />
          </View>
          <View className="flex-col gap-2">
            <View className="flex-row justify-between">
              <Text className="font-body-md text-on-surface-variant">Order Time</Text>
              <Text className="font-label-lg text-on-surface">{new Date(info.order_time).toLocaleString()}</Text>
            </View>
            {info.estimated_ready_time && (
              <View className="flex-row justify-between">
                <Text className="font-body-md text-on-surface-variant">Est. Ready</Text>
                <Text className="font-label-lg text-on-surface">{new Date(info.estimated_ready_time).toLocaleTimeString()}</Text>
              </View>
            )}
            {info.completed_at && (
              <View className="flex-row justify-between">
                <Text className="font-body-md text-on-surface-variant">Completed At</Text>
                <Text className="font-label-lg text-on-surface">{new Date(info.completed_at).toLocaleTimeString()}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Items List */}
        <Text className="font-title-lg text-on-background mb-3 mt-2">Order Items</Text>
        <View className="bg-surface-container-lowest rounded-2xl p-2 mb-4 shadow-sm border border-outline-variant/10">
          {items.map((item, idx) => (
            <View key={idx} className={`flex-row justify-between items-center p-2 ${idx !== items.length - 1 ? 'border-b border-outline-variant/20' : ''}`}>
              <View className="flex-row items-center flex-1">
                <View className="w-8 h-8 bg-surface-container rounded-md items-center justify-center mr-3">
                  <Text className="font-title-sm text-primary">{item.quantity}x</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-title-sm text-on-surface">{item.item_name}</Text>
                </View>
              </View>
              <Text className="font-title-sm text-on-surface">
                {formatCurrency(parseFloat(item.price_at_order) * item.quantity)}
              </Text>
            </View>
          ))}
          
          <View className="border-t border-outline-variant/30 mt-2 p-3 flex-row justify-between items-center">
            <Text className="font-title-md text-on-surface">Total Amount</Text>
            <Text className="font-headline-sm text-primary">{formatCurrency(parseFloat(info.total_price))}</Text>
          </View>
        </View>

        {/* Actions */}
        {isCancellable && (
          <TouchableOpacity 
            className={`mt-4 bg-error-container p-4 rounded-full items-center flex-row justify-center ${isCancelling ? 'opacity-70' : ''}`}
            onPress={handleCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <ActivityIndicator size="small" color="#8C1D18" className="mr-2" />
            ) : (
              <MaterialIcons name="cancel" size={20} color="#8C1D18" className="mr-2" />
            )}
            <Text className="text-on-error-container font-title-md">
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
