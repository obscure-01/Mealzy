// src/data/foods.ts
import { FoodItem } from '@/types';

export const foods: FoodItem[] = [
  {
    id: '1',
    name: 'Veg Maharaja Burger',
    image: require('../assets/images/burger.jpg'),
    price: 60,
    categoryId: '1', // Snacks
    isPopular: true,
  },
  {
    id: '2',
    name: 'Masala Chai',
    image: require('../assets/images/masala_chai.jpg'),
    price: 15,
    categoryId: '3', // Beverages
    isPopular: true,
  },
  {
    id: '3',
    name: 'Cold Coffee',
    image: require('../assets/images/cold_coffee.jpg'),
    price: 70,
    categoryId: '3', // Beverages
    isPopular: true,
  },
  {
    id: '4',
    name: 'Crispy Masala Dosa',
    image: require('../assets/images/dosa.jpg'),
    price: 85,
    categoryId: '4', // South Indian
    isPopular: false,
  },
  // Add more items as needed for the UI
];
