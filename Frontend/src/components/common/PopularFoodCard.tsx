// src/components/common/PopularFoodCard.tsx
import React from 'react';
import { View, Text, Image, ImageSourcePropType, GestureResponderEvent, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PrimaryButton } from './PrimaryButton';
import { formatCurrency } from '../../utils/currency';

/**
 * Props for PopularFoodCard.
 */
export interface PopularFoodCardProps {
  /** Image source for the food item */
  image: ImageSourcePropType;
  /** Name of the food */
  name: string;
  /** Short description */
  description: string;
  /** Vegetarian flag – true = veg, false = non‑veg */
  isVeg: boolean;
  /** Preparation time in minutes */
  prepTime: number;
  /** Price as raw number */
  price: number;
  /** Handler when the Add button is pressed */
  onAdd?: (event: GestureResponderEvent) => void;
  /** Handler when the card is pressed */
  onPress?: (event: GestureResponderEvent) => void;
  /** Additional Tailwind classes */
  className?: string;
  /** Accessibility label override */
  accessibilityLabel?: string;
}

/**
 * Reusable card presenting a popular food item.
 * Uses NativeWind for styling and respects the project's theme tokens.
 */
export const PopularFoodCard = React.memo(({
  image,
  name,
  description,
  isVeg,
  prepTime,
  price,
  onAdd,
  onPress,
  className = '',
  accessibilityLabel,
}: PopularFoodCardProps) => {
  const vegColor = isVeg ? 'bg-success' : 'bg-error'; // using theme tokens for veg / non‑veg
  const vegLabel = isVeg ? 'Vegetarian' : 'Non‑vegetarian';

  const label = accessibilityLabel ?? `${name}, ${vegLabel}, preparation time ${prepTime} minutes, price ${formatCurrency(
    price
  )}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      accessibilityLabel={label}
      accessibilityRole="imagebutton"
      disabled={!onPress}
    >
      <View className={`min-w-[160px] bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(44,62,80,0.06)] border border-outline-variant/10 flex-col ${className}`}>
        <View className="relative h-28 w-full">
          <Image source={image} className="w-full h-full object-cover" />
          <View className="absolute top-2 right-2 w-5 h-5 bg-white rounded-md flex items-center justify-center shadow-sm">
            <View className={`w-2.5 h-2.5 rounded-full ${vegColor}`} />
          </View>
        </View>
        <View className="p-3 flex-col justify-between flex-1">
          <View>
            <Text className="font-title-lg text-sm mb-1 truncate" numberOfLines={1}>
              {name}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="font-headline-md text-on-surface text-base">{formatCurrency(price)}</Text>
            <TouchableOpacity
              onPress={onAdd}
              accessibilityLabel={typeof onAdd === 'function' ? `Add ${name}` : undefined}
              activeOpacity={0.8}
            >
              <View className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center">
                <MaterialIcons name="add" size={18} color="#005027" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

PopularFoodCard.displayName = 'PopularFoodCard';
