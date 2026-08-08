// src/services/homeService.ts
import api from './api';

export interface BackendCanteen {
  canteen_id: number;
  canteen_name: string;
  canteen_location: string;
  opening_time: string;
  closing_time: string;
  is_open: boolean;
}

export interface BackendItem {
  item_id: number;
  canteen_id: number;
  item_name: string;
  description: string;
  price: string;
  image_url?: string;
  category: string;
  is_vegetarian: boolean;
  is_available: boolean;
}

export const homeService = {
  getCanteens: async (): Promise<BackendCanteen[]> => {
    try {
      const response = await api.get('/canteen');
      return response.data.canteen_data || [];
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getCanteen: async (canteen_id: number): Promise<BackendCanteen | null> => {
    try {
      const response = await api.get(`/canteen/${canteen_id}`);
      return response.data.canteen_data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getAvailableMenu: async (canteen_id: number): Promise<BackendItem[]> => {
    try {
      const response = await api.get(`/menu/${canteen_id}`);
      return response.data.menu || [];
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getItem: async (item_id: number): Promise<BackendItem | null> => {
    try {
      const response = await api.get(`/item/${item_id}`);
      return response.data.item_data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getAllAvailableItems: async (canteens: BackendCanteen[]): Promise<BackendItem[]> => {
    const menus = await Promise.all(
      canteens.map((c) => homeService.getAvailableMenu(c.canteen_id))
    );
    return menus.flat();
  }
};
