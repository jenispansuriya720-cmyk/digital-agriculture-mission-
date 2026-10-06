import api from './api';
import { Scheme } from '../types';

export const schemeService = {
  getSchemes: async (params?: { category?: string; search?: string; state?: string }): Promise<{ success: boolean; data: Scheme[] }> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/schemes${query ? `?${query}` : ''}`);
    return response.data;
  },

  recommendSchemes: async (criteria: { state?: string; landArea?: number; crop?: string; farmerType?: string; irrigationType?: string }): Promise<{
    success: boolean;
    data: Scheme[];
  }> => {
    const response = await api.post('/schemes/recommend', criteria);
    return response.data;
  },

  createScheme: async (schemeData: Partial<Scheme>): Promise<{ success: boolean; data: Scheme; message: string }> => {
    const response = await api.post('/schemes', schemeData);
    return response.data;
  },

  updateScheme: async (id: string, schemeData: Partial<Scheme>): Promise<{ success: boolean; data: Scheme; message: string }> => {
    const response = await api.put(`/schemes/${id}`, schemeData);
    return response.data;
  },

  deleteScheme: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/schemes/${id}`);
    return response.data;
  },
};
