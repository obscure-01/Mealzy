// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Please enter both phone number and password');
      return;
    }

    try {
      setIsLoading(true);
      await login(phoneNumber, password);
    } catch (error: any) {
      console.log('--- LOGIN DIAGNOSTICS ---');
      console.log('Request URL:', error.config?.url);
      console.log('Method:', error.config?.method);
      console.log('Payload:', error.config?.data);
      console.log('Response Status:', error.response?.status);
      console.log('Response Body:', error.response?.data);
      console.log('Axios Message:', error.message);
      console.log('Stack Trace:', error.stack);
      console.log('-------------------------');
      
      const message = error.response?.data?.message || error.message || 'Failed to login. Please try again.';
      Alert.alert('Login Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-container-margin justify-center" edges={['top', 'bottom']}>
      <View className="mb-10">
        <Text className="font-display-sm text-primary text-center">Mealzy</Text>
        <Text className="font-headline-sm text-on-surface text-center mt-2">Sign in to continue</Text>
      </View>

      <View className="flex-col gap-4">
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
          <PrimaryButton onPress={handleLogin}>
            {isLoading ? <ActivityIndicator color="#fff" /> : 'Log In'}
          </PrimaryButton>
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="font-body-md text-on-surface-variant">Don't have an account? </Text>
          <Text 
            className="font-body-md text-primary font-bold"
            onPress={() => navigation.navigate('Register')}
          >
            Sign Up
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
