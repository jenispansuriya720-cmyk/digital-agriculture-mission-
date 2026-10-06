import api from './api';
import { Expert } from '../types';

export const expertService = {
  getExperts: async (params?: { specialization?: string; available?: boolean }): Promise<{ success: boolean; data: Expert[] }> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/experts${query ? `?${query}` : ''}`);
    return response.data;
  },

  getExpertById: async (id: string): Promise<{ success: boolean; data: Expert }> => {
    const response = await api.get(`/experts/${id}`);
    return response.data;
  },

  createExpert: async (expertData: Partial<Expert>): Promise<{ success: boolean; data: Expert; message: string }> => {
    const response = await api.post('/experts', expertData);
    return response.data;
  },

  updateExpert: async (id: string, expertData: Partial<Expert>): Promise<{ success: boolean; data: Expert; message: string }> => {
    const response = await api.put(`/experts/${id}`, expertData);
    return response.data;
  },

  deleteExpert: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/experts/${id}`);
    return response.data;
  },
};
