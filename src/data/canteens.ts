// src/data/canteens.ts
import { Canteen } from '@/types';

export const canteens: Canteen[] = [
  {
    id: '1',
    name: 'A Block Canteen',
    image: require('../assets/images/acan.jpg'),
    openHours: '8:00 AM - 8:00 PM',
  },
  {
    id: '2',
    name: 'B Block Canteen',
    image: require('../assets/images/bcan.jpg'),
    openHours: '9:00 AM - 7:00 PM',
  },
];
