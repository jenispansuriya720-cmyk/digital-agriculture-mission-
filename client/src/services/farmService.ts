import api from './api';
import { Farm } from '../types';

export const farmService = {
  getFarms: async (selfOnly = false): Promise<{ success: boolean; data: Farm[] }> => {
    const response = await api.get(`/farms${selfOnly ? '?self=true' : ''}`);
    return response.data;
  },

  getFarmById: async (id: string): Promise<{ success: boolean; data: Farm }> => {
    const response = await api.get(`/farms/${id}`);
    return response.data;
  },

  createFarm: async (farmData: Partial<Farm>): Promise<{ success: boolean; data: Farm; message: string }> => {
    const response = await api.post('/farms', farmData);
    return response.data;
  },

  updateFarm: async (id: string, farmData: Partial<Farm>): Promise<{ success: boolean; data: Farm; message: string }> => {
    const response = await api.put(`/farms/${id}`, farmData);
    return response.data;
  },

  deleteFarm: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/farms/${id}`);
    return response.data;
  },
};
