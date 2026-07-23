// src/components/common/StatusBadge.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { PropsWithChildren } from 'react';

type StatusBadgeProps = PropsWithChildren<{
  status: string;
  className?: string;
  accessibilityLabel?: string;
}>;

/**
 * Simple badge to display a status label (e.g., "Preparing", "Ready").
 * Styling follows the design system – background uses `primary-container` with appropriate text color.
 */
export const StatusBadge = React.memo(({ status, className = '', accessibilityLabel }: StatusBadgeProps) => {
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || `Status: ${status}`}
      className={`bg-primary-container text-on-primary-container px-3 py-1 rounded-full ${className}`}
    >
      <Text className="font-label-lg text-on-primary-container">{status}</Text>
    </View>
  );
});

StatusBadge.displayName = 'StatusBadge';
