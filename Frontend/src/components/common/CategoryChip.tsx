// src/components/common/CategoryChip.tsx
import React from 'react';
import { TouchableOpacity, Text, GestureResponderEvent, View } from 'react-native';

type CategoryChipProps = {
  label: string;
  selected?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  className?: string; // extra Tailwind classes
  accessibilityLabel?: string;
};

/** Reusable chip component representing a selectable category. Uses design tokens via NativeWind classes. */
export const CategoryChip = React.memo(({ label, selected = false, onPress, className = '', accessibilityLabel }: CategoryChipProps) => {
  const baseClasses = 'px-6 py-2.5 rounded-full flex-row items-center justify-center';
  const selectedClasses = selected ? 'bg-primary shadow-md' : 'bg-surface-container-highest';
  const textClasses = selected ? 'text-on-primary' : 'text-on-surface-variant';

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      activeOpacity={0.8}
    >
      <View className={`${baseClasses} ${selectedClasses} ${className}`}>
        <Text className={`font-label-lg whitespace-nowrap ${textClasses}`}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
});

CategoryChip.displayName = 'CategoryChip';
