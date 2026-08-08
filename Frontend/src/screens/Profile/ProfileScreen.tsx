import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { ProfileScreenProps } from '@/navigation/types';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, logout } = useAuth();

  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 bg-surface-container-lowest border-b border-outline-variant/20 shadow-sm flex-row items-center justify-between z-10">
        <Text className="font-headline-sm text-on-surface">My Profile</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        {/* Avatar Section */}
        <View className="items-center mb-8">
          <View className="relative shadow-md rounded-full bg-white p-1">
            <Image
              source={
                user?.profile_picture_url
                  ? { uri: user.profile_picture_url }
                  : require('../../assets/images/avatar.png')
              }
              className="w-32 h-32 rounded-full"
            />
          </View>
          <Text className="font-headline-md text-on-surface mt-4">{user?.name}</Text>
          <View className="bg-primary-container px-3 py-1 rounded-full mt-2">
            <Text className="font-label-md text-on-primary-container capitalize">{user?.role}</Text>
          </View>
        </View>

        {/* Info Section */}
        <View className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-outline-variant/10 mb-8">
          <View className="flex-row items-center mb-5">
            <View className="bg-secondary-container p-2 rounded-xl mr-4">
              <MaterialIcons name="email" size={24} color="#384a3a" />
            </View>
            <View>
              <Text className="font-caption text-secondary mb-1">Email</Text>
              <Text className="font-body-lg text-on-surface">{user?.email}</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="bg-secondary-container p-2 rounded-xl mr-4">
              <MaterialIcons name="phone" size={24} color="#384a3a" />
            </View>
            <View>
              <Text className="font-caption text-secondary mb-1">Phone Number</Text>
              <Text className="font-body-lg text-on-surface">{user?.phone_number}</Text>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <TouchableOpacity
          onPress={handleEditProfile}
          className="bg-primary rounded-2xl py-4 flex-row items-center justify-center shadow-md mb-4"
        >
          <MaterialIcons name="edit" size={20} color="white" className="mr-2" />
          <Text className="text-white font-label-lg ml-2">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={logout}
          className="bg-error-container rounded-2xl py-4 flex-row items-center justify-center shadow-md"
        >
          <MaterialIcons name="logout" size={20} color="#ba1a1a" className="mr-2" />
          <Text className="text-on-error-container font-label-lg ml-2">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
