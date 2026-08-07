import React from 'react';
import './src/global.css';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
