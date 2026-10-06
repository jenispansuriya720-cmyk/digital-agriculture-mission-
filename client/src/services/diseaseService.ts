import api from './api';
import { DiseaseReport } from '../types';

export const diseaseService = {
  analyzeCropDisease: async (data: { cropName?: string; imageUrl?: string }): Promise<{
    success: boolean;
    data: DiseaseReport;
    message: string;
    disclaimer: string;
  }> => {
    const response = await api.post('/disease/analyze', data);
    return response.data;
  },

  getMyDiseaseHistory: async (): Promise<{ success: boolean; data: DiseaseReport[] }> => {
    const response = await api.get('/disease/history');
    return response.data;
  },
};
