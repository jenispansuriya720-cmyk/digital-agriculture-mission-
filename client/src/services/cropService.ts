import api from './api';
import { Crop } from '../types';

export const cropService = {
  getCrops: async (farmId?: string): Promise<{ success: boolean; data: Crop[] }> => {
    const url = farmId ? `/crops?farmId=${farmId}` : '/crops';
    const response = await api.get(url);
    return response.data;
  },

  getCropById: async (id: string): Promise<{ success: boolean; data: Crop }> => {
    const response = await api.get(`/crops/${id}`);
    return response.data;
  },

  createCrop: async (cropData: Partial<Crop>): Promise<{ success: boolean; data: Crop; message: string }> => {
    const response = await api.post('/crops', cropData);
    return response.data;
  },

  updateCrop: async (id: string, cropData: Partial<Crop>): Promise<{ success: boolean; data: Crop; message: string }> => {
    const response = await api.put(`/crops/${id}`, cropData);
    return response.data;
  },

  deleteCrop: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/crops/${id}`);
    return response.data;
  },
};
