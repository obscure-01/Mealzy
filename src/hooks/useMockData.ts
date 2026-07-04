// src/hooks/useMockData.ts
import { useEffect, useState } from 'react';
import { Canteen, Category, FoodItem, Order } from '@/types';
import { getActiveOrder, getCanteens, getCategories, getFoods } from '@/services/mockDataService';

/**
 * Hook that loads all mock data needed for the HomeScreen.
 * It performs no transformation or business logic – the data is returned
 * exactly as fetched from the mock service and typed via the shared types.
 */
export const useMockData = () => {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [popularFoods, setPopularFoods] = useState<FoodItem[]>([]);
  const [todaysSpecials, setTodaysSpecials] = useState<FoodItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const order = await getActiveOrder();
      const canteensData = await getCanteens();
      const categoriesData = await getCategories();
      const foodsData = await getFoods();

      setActiveOrder(order);
      setCanteens(canteensData);
      setCategories(categoriesData);
      setFoods(foodsData);
      setPopularFoods(foodsData.filter((f) => f.isPopular));
      setTodaysSpecials(foodsData);
    };
    load();
  }, []);

  return {
    activeOrder,
    canteens,
    categories,
    foods,
    popularFoods,
    todaysSpecials,
  } as const;
};
