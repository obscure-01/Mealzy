// src/components/home/Header.tsx
import React from 'react';
import { View, Image, Text } from 'react-native';
import { PropsWithChildren } from 'react';

export type HeaderProps = PropsWithChildren<{
  avatarSource: any; // require image asset
  className?: string;
}>;

/**
 * Header component for the top app bar.
 * Renders the user's avatar on the left and any optional children (e.g., logo) on the right.
 * Uses NativeWind Tailwind classes to match the Stitch design.
 */
export const Header = React.memo(({ avatarSource, children, className = '' }: HeaderProps) => {
  return (
    <View
      className={`bg-background flex-row justify-between items-center px-container-margin py-md w-full z-40 ${className}`}
      accessible
      accessibilityRole="header"
    >
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container" accessibilityLabel="User avatar">
          <Image source={avatarSource} className="w-full h-full object-cover" />
        </View>
        {children}
      </View>
      <View className="flex-row items-center gap-4 hidden md:flex">
         <Text className="font-display-lg text-[32px] text-primary dark:text-primary-fixed-dim">Mealzy</Text>
      </View>
    </View>
  );
});

Header.displayName = 'Header';
