import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { homeService, BackendCanteen } from '@/services/homeService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'CanteenDetailScreen'>;

export default function CanteenDetailScreen({ route, navigation }: Props) {
  const { canteenId, canteenName } = route.params;
  const [canteen, setCanteen] = useState<BackendCanteen | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchCanteen = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await homeService.getCanteen(canteenId);
        if (mounted) setCanteen(data);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load canteen details');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchCanteen();
    return () => { mounted = false; };
  }, [canteenId]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-outline-variant/20">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
          <MaterialIcons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>
        <Text className="font-title-lg text-on-surface flex-1">{canteenName}</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#006d37" />
        </View>
      ) : error || !canteen ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="font-headline-md text-error mb-2">Oops!</Text>
          <Text className="font-body-lg text-on-background text-center">{error || 'Canteen not found'}</Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          <Image
            source={(canteen as any).image_url ? { uri: (canteen as any).image_url } : require('../../assets/images/acan.jpg')}
            className="w-full h-64"
            resizeMode="cover"
          />
          <View className="p-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-headline-md text-on-surface flex-1">{canteen.canteen_name}</Text>
              <View className={`px-3 py-1 rounded-full ${canteen.is_open ? 'bg-primary-container' : 'bg-error-container'}`}>
                <Text className={`font-label-md ${canteen.is_open ? 'text-on-primary-container' : 'text-on-error-container'}`}>
                  {canteen.is_open ? 'Open' : 'Closed'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-4">
              <View className="bg-secondary-container p-2 rounded-xl mr-3">
                <MaterialIcons name="location-on" size={24} color="#384a3a" />
              </View>
              <View>
                <Text className="font-caption text-secondary">Location</Text>
                <Text className="font-body-lg text-on-surface">{canteen.canteen_location}</Text>
              </View>
            </View>

            <View className="flex-row items-center mt-6">
              <View className="bg-secondary-container p-2 rounded-xl mr-3">
                <MaterialIcons name="access-time" size={24} color="#384a3a" />
              </View>
              <View>
                <Text className="font-caption text-secondary">Operating Hours</Text>
                <Text className="font-body-lg text-on-surface">{canteen.opening_time} - {canteen.closing_time}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('CanteenMenuScreen', { canteenId: canteen.canteen_id, canteenName: canteen.canteen_name })}
              className="bg-primary rounded-2xl py-4 mt-10 items-center shadow-md flex-row justify-center"
            >
              <Text className="text-white font-label-lg mr-2">Browse Menu</Text>
              <MaterialIcons name="restaurant-menu" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
