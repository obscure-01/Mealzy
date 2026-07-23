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
  className = '',
  accessibilityLabel,
}: PopularFoodCardProps) => {
  const vegColor = isVeg ? 'bg-success' : 'bg-error'; // using theme tokens for veg / non‑veg
  const vegLabel = isVeg ? 'Vegetarian' : 'Non‑vegetarian';

  const label = accessibilityLabel ?? `${name}, ${vegLabel}, preparation time ${prepTime} minutes, price ${formatCurrency(
    price
  )}`;

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="imagebutton"
      className={`min-w-[160px] w-40 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 flex-col ${className}`}
    >
      <View className="relative h-28 w-full">
        <Image source={image} className="w-full h-full object-cover" />
        <View className="absolute top-2 right-2 bg-white rounded flex items-center justify-center w-6 h-6 shadow-sm">
          <View className={`w-3 h-3 rounded-full ${vegColor}`} />
        </View>
      </View>
      <View className="p-3 flex-col justify-between flex-1">
        <View>
          <Text className="font-label-lg text-on-surface mb-1" numberOfLines={1}>
            {name}
          </Text>
          <Text className="font-body-sm text-secondary" numberOfLines={1}>
            {description}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="font-title-md text-on-surface">{formatCurrency(price)}</Text>
          <TouchableOpacity
            onPress={onAdd}
            accessibilityLabel={typeof onAdd === 'function' ? `Add ${name}` : undefined}
            className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm"
          >
            <MaterialIcons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

PopularFoodCard.displayName = 'PopularFoodCard';
