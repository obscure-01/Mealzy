// src/components/home/SearchBar.tsx
import React from 'react';
import { View, TextInput, GestureResponderEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type SearchBarProps = {
  /** Current text value */
  value: string;
  /** Callback when text changes */
  onChangeText: (text: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Optional clear or filter icon press handler */
  onIconPress?: (event: GestureResponderEvent) => void;
  /** Additional Tailwind classes */
  className?: string;
};

/**
 * Search bar component matching the Stitch design.
 * Uses a leading search icon and a trailing tune (filter) icon.
 * Memoized because it contains a TextInput which re‑renders frequently.
 */
export const SearchBar = React.memo(
  ({ value, onChangeText, placeholder = 'Search food or canteen...', onIconPress, className = '' }: SearchBarProps) => {
    return (
      <View className={`relative ${className}`}>
        <View className="flex-row items-center bg-surface-container-lowest shadow-[0px_4px_20px_rgba(44,62,80,0.06)] rounded-full px-5 py-3 gap-3 border border-outline-variant/30">
          <MaterialIcons name="search" size={24} color="#6c7b6d" />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(108,123,109,0.6)"
            style={{ flex: 1, fontSize: 14, color: '#091d2e' }}
            className="font-body-md"
          />
          <MaterialIcons name="tune" size={24} color="#006d37" onPress={onIconPress} />
        </View>
      </View>
    );
  }
);

SearchBar.displayName = 'SearchBar';
