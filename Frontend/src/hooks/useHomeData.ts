// src/hooks/useHomeData.ts
import { useEffect, useState } from 'react';
import { Canteen, Category, FoodItem, Order } from '@/types';
import { homeService, BackendCanteen, BackendItem } from '@/services/homeService';
import { orderService } from '@/services/orderService';

export const useHomeData = () => {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [popularFoods, setPopularFoods] = useState<FoodItem[]>([]);
  const [todaysSpecials, setTodaysSpecials] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch canteens
      const backendCanteens = await homeService.getCanteens();
      
      // Fetch all items from all canteens
      const backendItems = await homeService.getAllAvailableItems(backendCanteens);

      // Map canteens
      const mappedCanteens: (Canteen & { isOpen: boolean })[] = backendCanteens.map((c, index) => ({
        id: c.canteen_id.toString(),
        name: c.canteen_name,
        image: index % 2 === 0
          ? require('../assets/images/acan.jpg')
          : require('../assets/images/bcan.jpg'),
        openHours: `${c.opening_time} - ${c.closing_time}`,
        isOpen: c.is_open,
      }));

      // Map items
      const mappedFoods: FoodItem[] = backendItems.map(item => ({
        id: item.item_id.toString(),
        name: item.item_name,
        image: item.image_url ? { uri: item.image_url } : require('../assets/images/burger.jpg'),
        price: parseFloat(item.price),
        categoryId: item.category, // using category name as id for now
        isPopular: false,
        isVegetarian: item.is_vegetarian,
      }));

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(backendItems.map(i => i.category))).map(catName => ({
        id: catName,
        name: catName,
      }));

      // Derive Popular Foods (just take first 5 items, or randomize, backend has no isPopular)
      const popular = mappedFoods.slice(0, 5);
      
      // Derive Today's Specials (take 1 or 2 items from the end, or similar)
      const specials = mappedFoods.length > 0 ? [mappedFoods[mappedFoods.length - 1]] : [];

      // Sort canteens: Open canteens first
      mappedCanteens.sort((a, b) => {
        if (a.isOpen && !b.isOpen) return -1;
        if (!a.isOpen && b.isOpen) return 1;
        return 0;
      });

      setCanteens(mappedCanteens);
      setFoods(mappedFoods);
      setCategories(uniqueCategories);
      setPopularFoods(popular);
      setTodaysSpecials(specials);
      
      // Active Order Logic
      const orders = await orderService.getUserOrderHistory().catch(() => []);
      const active = orders.find(o => o.status === 'pending' || o.status === 'preparing');
      
      if (active) {
        setActiveOrder({
          token: active.order_id.toString(),
          status: active.status,
          readyInMinutes: 15, // Backend does not provide dynamic ready time
        });
      } else {
        setActiveOrder(null);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load home data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    activeOrder,
    canteens,
    categories,
    foods,
    popularFoods,
    todaysSpecials,
    isLoading,
    error,
    retry: load,
  } as const;
};
