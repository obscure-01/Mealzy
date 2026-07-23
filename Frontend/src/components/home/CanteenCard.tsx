// src/components/home/CanteenCard.tsx
import React from 'react';
import { TouchableOpacity, View, Image, Text, GestureResponderEvent, ImageSourcePropType } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency } from '../../utils/currency';

type CanteenCardProps = {
  image: ImageSourcePropType;
  name: string;
  waitingTime?: number; // minutes
  isOpen: boolean;
  openingHours?: string; // e.g. "8:00 AM – 8:00 PM"
  onPress?: (event: GestureResponderEvent) => void;
  className?: string;
  accessibilityLabel?: string;
  variant?: 'primary' | 'secondary';
};

/**
 * Card displaying a canteen preview.
 * Shows image, name, open/closed badge, optional waiting time, and opening hours.
 * All styling uses design tokens via NativeWind.
 */
export const CanteenCard = React.memo(({
  image,
  name,
  waitingTime = 5,
  isOpen,
  openingHours,
  onPress,
  className = '',
  accessibilityLabel,
  variant = 'primary',
}: CanteenCardProps) => {
  const Container = isOpen && onPress ? TouchableOpacity : View;
  const containerProps = isOpen && onPress ? { onPress, accessibilityRole: 'button' as const } : {};

  const buttonClass = variant === 'primary' 
    ? 'bg-primary' 
    : 'bg-surface-variant opacity-90';
    
  const buttonTextClass = variant === 'primary'
    ? 'text-white'
    : 'text-on-surface-variant';

  return (
    <Container
      {...containerProps}
      accessibilityLabel={accessibilityLabel ?? `${name}`}
      className={`bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/30 flex-col ${className}`}
    >
      <View className="relative h-40 w-full">
        <Image source={image} className="w-full h-full object-cover" />
        <View className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-full flex-row items-center gap-1.5 shadow-sm">
          <MaterialIcons name="timer" size={16} color="#ba1a1a" />
          <Text className="font-label-md text-on-surface">{waitingTime} min</Text>
        </View>
      </View>
      <View className="p-4 flex-row items-center justify-between">
        <View className="flex-col">
          <Text className="font-title-lg text-on-surface mb-1">{name}</Text>
          <View className="flex-row items-center gap-1.5 text-secondary">
            <MaterialIcons name="schedule" size={16} color="#6c7b6d" />
            <Text className="font-body-sm text-secondary">
              {isOpen ? `Open ${openingHours}` : 'Closed'}
            </Text>
          </View>
        </View>
        <TouchableOpacity className={`px-4 py-2.5 rounded-xl shadow-sm ${buttonClass}`}>
          <Text className={`font-label-md ${buttonTextClass}`}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
});

CanteenCard.displayName = 'CanteenCard';
