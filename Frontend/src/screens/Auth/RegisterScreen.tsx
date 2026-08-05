// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !phoneNumber || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await register({ name, email, phone_number: phoneNumber, password });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to register. Please try again.';
      Alert.alert('Registration Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <ScrollView contentContainerClassName="px-container-margin py-8">
        <View className="mb-10">
          <Text className="font-display-sm text-primary text-center">Mealzy</Text>
          <Text className="font-headline-sm text-on-surface text-center mt-2">Create an account</Text>
        </View>

        <View className="flex-col gap-4">
          <TextInput
            className="bg-surface-container rounded-xl px-4 py-3 font-body-lg text-on-surface"
            placeholder="Full Name"
            placeholderTextColor="#79747E"
            value={name}
            onChangeText={setName}
            editable={!isLoading}
          />
          <TextInput
            className="bg-surface-container rounded-xl px-4 py-3 font-body-lg text-on-surface"
            placeholder="Email Address"
            placeholderTextColor="#79747E"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />
          <TextInput
            className="bg-surface-container rounded-xl px-4 py-3 font-body-lg text-on-surface"
            placeholder="Phone Number"
            placeholderTextColor="#79747E"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={!isLoading}
          />
          <TextInput
            className="bg-surface-container rounded-xl px-4 py-3 font-body-lg text-on-surface"
            placeholder="Password"
            placeholderTextColor="#79747E"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />

          <View className="mt-4">
            <PrimaryButton onPress={handleRegister}>
              {isLoading ? <ActivityIndicator color="#fff" /> : 'Sign Up'}
            </PrimaryButton>
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="font-body-md text-on-surface-variant">Already have an account? </Text>
            <Text 
              className="font-body-md text-primary font-bold"
              onPress={() => navigation.navigate('Login')}
            >
              Log In
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
