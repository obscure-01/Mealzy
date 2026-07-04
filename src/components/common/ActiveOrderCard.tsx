import React from 'react';
import {
  View,
  Text,
  GestureResponderEvent,
  ViewProps,
  TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { formatMinutes } from '../../utils/time';
import { Order } from '../../types';

export interface ActiveOrderCardProps extends ViewProps {
  token: string;
  status: Order['status'];
  readyInMinutes: number;
  onPress?: (event: GestureResponderEvent) => void;
  className?: string;
  accessibilityLabel?: string;
}

const statusTextMap: Record<Order['status'], string> = {
  preparing: 'Preparing your meal',
  ready: 'Your meal is ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const ActiveOrderCard = React.memo((props: ActiveOrderCardProps) => {
  const {
    token,
    status,
    readyInMinutes,
    onPress,
    className = '',
    accessibilityLabel,
    ...restProps
  } = props as ActiveOrderCardProps;

  const label =
    accessibilityLabel ??
    `Order number ${token}. Status ${status}. Estimated waiting time ${readyInMinutes} minutes.`;

  return (
    <View
      {...restProps}
      className={`bg-primary rounded-3xl p-5 shadow-lg relative overflow-hidden ${className}`}
      accessibilityLabel={label}
      accessible
    >
      <View className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
      
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <View className="bg-white/20 px-4 py-1.5 rounded-full mb-2 self-start">
            <Text className="font-title-lg text-white uppercase tracking-wider font-bold">TOKEN {token}</Text>
          </View>
          <Text className="font-headline-md text-white">{statusTextMap[status] || status}</Text>
        </View>
        <View className="bg-white/20 p-2 rounded-xl">
          <MaterialIcons name="timer" size={24} color="white" />
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-6">
        <View className="flex-row items-center gap-3">
          <View className="flex-col">
            <Text className="font-caption text-white/70">Ready in</Text>
            <Text className="font-headline-md text-white">{readyInMinutes} min</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onPress}
          accessibilityLabel={`Track order ${token}`}
          className="bg-white px-5 py-2.5 rounded-2xl flex-row items-center gap-2 shadow-md"
        >
          <Text className="text-primary font-label-lg">Track Order</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#006d37" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

ActiveOrderCard.displayName = 'ActiveOrderCard';
