// src/components/common/TodaysSpecialCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  GestureResponderEvent,
  TouchableOpacity
} from 'react-native';
import { formatCurrency } from '../../utils/currency';

export interface TodaysSpecialCardProps {
  image: ImageSourcePropType;
  name: string;
  price: number;
  onPress?: (event: GestureResponderEvent) => void;
  badgeText?: string;
  className?: string;
  accessibilityLabel?: string;
}

export const TodaysSpecialCard = React.memo(({
  image,
  name,
  price,
  onPress,
  badgeText = "Best Seller",
  className = '',
  accessibilityLabel,
}: TodaysSpecialCardProps) => {
  const label = accessibilityLabel ?? `${name}, special offer, price ${formatCurrency(price)}`;
  
  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { onPress, accessibilityRole: 'button' as const } : { accessibilityRole: 'imagebutton' as const };

  return (
    <Container
      {...containerProps}
      accessibilityLabel={label}
      className={`w-full bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0px_4px_20px_rgba(44,62,80,0.06)] border border-outline-variant/10 flex-col ${className}`}
    >
      <View className="h-56 w-full relative">
        <Image source={image} className="w-full h-full object-cover" />

        <View className="absolute inset-0 bg-black/40 flex-col justify-end p-5">
          <View className="flex-row justify-between items-end">
            <View className="flex-1 mr-4">
              <View className="bg-tertiary px-3 py-1 rounded-full self-start mb-2 inline-block">
                <Text className="text-white font-label-lg">{badgeText}</Text>
              </View>
              <Text className="font-display-lg text-2xl text-white mb-1">{name}</Text>
            </View>
            <View className="items-end">
              <Text className="font-headline-lg text-white block mb-2">{formatCurrency(price)}</Text>
              <TouchableOpacity className="bg-primary px-5 py-2.5 rounded-2xl shadow-lg mt-2 active-scale" onPress={onPress}>
                <Text className="text-white font-label-lg">View Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
});

TodaysSpecialCard.displayName = 'TodaysSpecialCard';
