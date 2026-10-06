import api from './api';
import { Order } from '../types';

export const orderService = {
  createOrder: async (orderData: any): Promise<{ success: boolean; data: Order; message: string }> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getMyOrders: async (): Promise<{ success: boolean; data: Order[] }> => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (id: string): Promise<{ success: boolean; data: Order }> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string, note?: string): Promise<{ success: boolean; data: Order; message: string }> => {
    const response = await api.put(`/orders/${id}/status`, { status, note });
    return response.data;
  },
};
