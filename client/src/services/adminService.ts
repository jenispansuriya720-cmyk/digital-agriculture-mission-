import api from './api';
import { User } from '../types';

export const adminService = {
  getStats: async (): Promise<{
    success: boolean;
    data: {
      totalFarmers: number;
      totalFarms: number;
      totalCrops: number;
      totalProducts: number;
      totalOrders: number;
      totalRevenue: number;
      totalExperts: number;
      totalArticles: number;
      totalSchemes: number;
      totalMarketRecords: number;
      cropDistribution: Array<{ name: string; count: number; area: number }>;
      ordersByStatus: Record<string, number>;
      recentFarmers: User[];
      recentOrders: any[];
    };
  }> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAllUsers: async (params?: { search?: string; role?: string }): Promise<{ success: boolean; data: User[] }> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/users${query ? `?${query}` : ''}`);
    return response.data;
  },

  toggleBlockUser: async (id: string): Promise<{ success: boolean; data: User; message: string }> => {
    const response = await api.put(`/users/${id}/block`);
    return response.data;
  },

  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
