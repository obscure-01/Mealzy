// src/components/common/TodaysSpecialCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  GestureResponderEvent,
  Pressable,
  ViewProps,
  PressableProps,
  TouchableOpacity
} from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { formatCurrency } from '../../utils/currency';

/** Props for TodaysSpecialCard. */
export interface TodaysSpecialCardProps {
  /** Image source for the food item */
  image: ImageSourcePropType;
  /** Name of the food */
  name: string;
  /** Price as raw number (in INR) */
  price: number;
  /** Optional handler for a button press (e.g., “Add to cart”) */
  onPress?: (event: GestureResponderEvent) => void;
  /** Optional custom badge text; defaults to "Today's Special" */
  badgeText?: string;
  /** Additional Tailwind classes for the container */
  className?: string;
  /** Accessibility label override */
  accessibilityLabel?: string;
}

/**
 * Reusable card for a “Today's Special” food item.
 * Mirrors the styling of `PopularFoodCard` where appropriate.
 */
export const TodaysSpecialCard = React.memo(
  ({
    image,
    name,
    price,
    onPress,
    badgeText = "Best Seller",
    className = '',
    accessibilityLabel,
  }: TodaysSpecialCardProps) => {
    const label = accessibilityLabel ?? `${name}, today's special, price ${formatCurrency(price)}`;
    const containerClasses = `relative rounded-3xl overflow-hidden shadow-md ${className}`;

    const content = (
      <View className="h-56 w-full">
        <Image source={image} className="w-full h-full object-cover" />
        <View className="absolute inset-0 bg-black/40" />
        
        <View className="absolute bottom-0 left-0 right-0 p-5">
          <View className="flex-row justify-between items-end">
            <View className="flex-1 mr-4">
              <View className="bg-error/90 px-3 py-1 rounded-full self-start mb-2">
                <Text className="text-white font-label-md">{badgeText}</Text>
              </View>
              <Text className="font-headline-sm text-white mb-1">{name}</Text>
              <Text className="font-body-md text-white/80" numberOfLines={1}>
                Served with 2 types of chutney & sambar
              </Text>
            </View>
            <View className="items-end">
              <Text className="font-title-lg text-white mb-2">{formatCurrency(price)}</Text>
              <TouchableOpacity className="bg-primary px-4 py-2 rounded-xl shadow-sm" onPress={onPress}>
                <Text className="text-white font-label-md">View Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );

    if (onPress) {
      return (
        <Pressable
          accessibilityLabel={label}
          accessibilityRole="button"
          onPress={onPress}
          className={containerClasses}
        >
          {content}
        </Pressable>
      );
    }

    return (
      <View accessibilityLabel={label} className={containerClasses}>
        {content}
      </View>
    );
  },
);

TodaysSpecialCard.displayName = 'TodaysSpecialCard';
