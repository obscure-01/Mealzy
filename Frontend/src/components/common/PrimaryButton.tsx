// src/components/common/PrimaryButton.tsx
import React from 'react';
import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import { PropsWithChildren } from 'react';

type PrimaryButtonProps = PropsWithChildren<{
  onPress?: (event: GestureResponderEvent) => void;
  className?: string; // additional Tailwind classes
  accessibilityLabel?: string;
}>;

/**
 * Reusable button component styled according to the Stitch design.
 * Uses NativeWind `className` for styling – defaults match the design for primary actions.
 */
export const PrimaryButton = React.memo(({ onPress, children, className = '', accessibilityLabel }: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={`bg-primary text-white px-5 py-2.5 rounded-2xl font-label-lg flex items-center gap-2 shadow-md ${className}`}
    >
      {typeof children === 'string' ? <Text className="text-white">{children}</Text> : children}
    </TouchableOpacity>
  );
});

PrimaryButton.displayName = 'PrimaryButton';
