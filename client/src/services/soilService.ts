import api from './api';
import { SoilReport } from '../types';

export const soilService = {
  getSoilReports: async (farmId?: string): Promise<{ success: boolean; data: SoilReport[] }> => {
    const url = farmId ? `/soil?farmId=${farmId}` : '/soil';
    const response = await api.get(url);
    return response.data;
  },

  createSoilReport: async (reportData: Partial<SoilReport>): Promise<{ success: boolean; data: SoilReport; message: string }> => {
    const response = await api.post('/soil', reportData);
    return response.data;
  },
};
