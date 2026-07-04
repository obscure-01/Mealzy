// src/components/home/GreetingSection.tsx
import React from 'react';
import { View, Text } from 'react-native';

export type GreetingSectionProps = {
  /** Greeting word, e.g. "Good Morning," */
  greeting?: string;
  /** User name to display */
  name: string;
  /** Optional emoji or icon after the name */
  suffix?: string;
  /** Additional Tailwind classes */
  className?: string;
};

/**
 * Simple greeting block displayed under the Header.
 * Renders two lines: a small secondary greeting and a larger name line.
 * No memoization – the component is lightweight and renders directly.
 */
export const GreetingSection = ({ greeting = 'Good Morning,', name, suffix = '👋', className = '' }: GreetingSectionProps) => {
  return (
    <View className={`flex flex-col ${className}`} accessible accessibilityRole="text">
      <Text className="font-body-md text-secondary block leading-none">{greeting}</Text>
      <Text className="font-title-lg text-on-surface">{name} {suffix}</Text>
    </View>
  );
};
