import api from './api';

export interface OrderItem {
  order_id?: number;
  item_name: string;
  image_url?: string;
  category: string;
  is_vegetarian: boolean;
  quantity: number;
  price_at_order: string;
}

export interface BackendOrder {
  order_id: number;
  user_id: number;
  canteen_id: number;
  total_price: string;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled' | string;
  order_time: string;
  completed_at?: string;
  cancelled_at?: string;
  estimated_ready_time?: string;
  items?: OrderItem[];
}

export interface OrderDetailsResponse {
  info: BackendOrder;
  items: OrderItem[];
}

export const orderService = {
  createOrder: async (canteen_id: number, items: Record<number, number>): Promise<void> => {
    // items is a map of item_id -> quantity
    await api.post('/orders', {
      canteen_id,
      items,
    });
  },

  getUserOrderHistory: async (): Promise<BackendOrder[]> => {
    try {
      const response = await api.get('/orders/user');
      return response.data.order_history || [];
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getUserOrder: async (order_id: number): Promise<OrderDetailsResponse | null> => {
    try {
      const response = await api.get(`/orders/user/${order_id}`);
      return response.data.order || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  cancelOrderUser: async (order_id: number): Promise<void> => {
    await api.put(`/orders/user/cancel/${order_id}`);
  },
};
