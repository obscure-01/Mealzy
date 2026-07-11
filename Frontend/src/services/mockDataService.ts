// src/services/mockDataService.ts
import { canteens } from '@/data/canteens';
import { categories } from '@/data/categories';
import { foods } from '@/data/foods';
import { Order, Canteen, Category, FoodItem } from '@/types';

// Mock active order
const activeOrder: Order = {
  token: 'A105',
  status: 'Preparing',
  readyInMinutes: 6,
};

export const getCanteens = async (): Promise<Canteen[]> => {
  // Simulate async call
  return new Promise<Canteen[]>(resolve => setTimeout(() => resolve(canteens), 200));
};

export const getCategories = async (): Promise<Category[]> => {
  return new Promise<Category[]>(resolve => setTimeout(() => resolve(categories), 200));
};

export const getFoods = async (): Promise<FoodItem[]> => {
  return new Promise<FoodItem[]>(resolve => setTimeout(() => resolve(foods), 200));
};

export const getActiveOrder = async (): Promise<Order> => {
  return new Promise<Order>(resolve => setTimeout(() => resolve(activeOrder), 200));
};
