// src/hooks/useHomeData.ts
import { useEffect, useState } from 'react';
import { Canteen, Category, FoodItem, Order } from '@/types';
import { homeService, BackendCanteen, BackendItem } from '@/services/homeService';

export const useHomeData = () => {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [popularFoods, setPopularFoods] = useState<FoodItem[]>([]);
  const [todaysSpecials, setTodaysSpecials] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch canteens
        const backendCanteens = await homeService.getCanteens();
        
        // Fetch all items from all canteens
        const backendItems = await homeService.getAllAvailableItems(backendCanteens);

        if (!isMounted) return;

        // Map canteens
        const mappedCanteens: (Canteen & { isOpen: boolean })[] = backendCanteens.map(c => ({
          id: c.canteen_id.toString(),
          name: c.canteen_name,
          image: require('../assets/images/canteen_one.png'), // No image from backend canteens, use local fallback
          openHours: `${c.opening_time} - ${c.closing_time}`,
          isOpen: c.is_open,
        }));

        // Map items
        const mappedFoods: FoodItem[] = backendItems.map(item => ({
          id: item.item_id.toString(),
          name: item.item_name,
          image: item.image_url ? { uri: item.image_url } : require('../assets/images/burger.png'),
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

        setCanteens(mappedCanteens);
        setFoods(mappedFoods);
        setCategories(uniqueCategories);
        setPopularFoods(popular);
        setTodaysSpecials(specials);
        setActiveOrder(null); // active order is out of scope for home integration, removing mock

      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load home data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    load();

    return () => {
      isMounted = false;
    };
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
  } as const;
};
