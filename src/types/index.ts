// src/types/index.ts
export interface Canteen {
  id: string;
  name: string;
  image: any; // require image asset
  openHours: string;
}

export interface FoodItem {
  id: string;
  name: string;
  image: any; // require image asset
  price: number; // price in INR
  categoryId: string;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Order {
  token: string;
  status: 'Preparing' | 'Ready' | 'Completed' | string;
  readyInMinutes: number;
}
