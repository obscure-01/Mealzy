import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { EditProfileScreenProps } from '@/navigation/types';
import { userService } from '@/services/userService';

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const { user, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handlePickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name || !email || !phoneNumber) {
      Alert.alert('Error', 'Name, email, and phone number are required.');
      return;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone_number', phoneNumber);

      if (imageUri) {
        // React Native FormData requires this specific shape for files
        const filename = imageUri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      await userService.updateProfile(formData);
      await refreshProfile();
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 py-4 bg-surface-container-lowest border-b border-outline-variant/20 shadow-sm flex-row items-center z-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="#1a1c19" />
        </TouchableOpacity>
        <Text className="font-headline-sm text-on-surface">Edit Profile</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        {/* Avatar Section */}
        <View className="items-center mb-8">
          <TouchableOpacity onPress={handlePickImage} className="relative shadow-md rounded-full bg-white p-1">
            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : user?.profile_picture_url
                  ? { uri: user.profile_picture_url }
                  : require('../../assets/images/avatar.png')
              }
              className="w-32 h-32 rounded-full"
            />
            <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full shadow-lg border-2 border-white">
              <MaterialIcons name="camera-alt" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View className="mb-6">
          <Text className="font-caption text-secondary mb-2 ml-1">Name</Text>
          <View className="flex-row items-center bg-surface-container-highest rounded-2xl px-4 py-3 border border-outline-variant/30 focus:border-primary">
            <MaterialIcons name="person" size={20} color="#384a3a" className="mr-3" />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              className="flex-1 font-body-lg text-on-surface"
              autoCapitalize="words"
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="font-caption text-secondary mb-2 ml-1">Email</Text>
          <View className="flex-row items-center bg-surface-container-highest rounded-2xl px-4 py-3 border border-outline-variant/30 focus:border-primary">
            <MaterialIcons name="email" size={20} color="#384a3a" className="mr-3" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              className="flex-1 font-body-lg text-on-surface"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="font-caption text-secondary mb-2 ml-1">Phone Number</Text>
          <View className="flex-row items-center bg-surface-container-highest rounded-2xl px-4 py-3 border border-outline-variant/30 focus:border-primary">
            <MaterialIcons name="phone" size={20} color="#384a3a" className="mr-3" />
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone Number"
              className="flex-1 font-body-lg text-on-surface"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Actions Section */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          className={`rounded-2xl py-4 flex-row items-center justify-center shadow-md ${
            isSaving ? 'bg-primary/50' : 'bg-primary'
          }`}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-label-lg">Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
