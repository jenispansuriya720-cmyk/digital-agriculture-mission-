import api from './api';
import { IrrigationData } from '../types';

export const irrigationService = {
  getIrrigation: async (): Promise<{ success: boolean; data: IrrigationData[] }> => {
    const response = await api.get('/irrigation');
    return response.data;
  },

  scheduleIrrigation: async (scheduleData: { farmId?: string; zoneName?: string; waterAmountLitres?: number; scheduledTime?: string; scheduledDate?: string }): Promise<{
    success: boolean;
    data: IrrigationData;
    message: string;
  }> => {
    const response = await api.post('/irrigation/schedule', scheduleData);
    return response.data;
  },

  toggleDemoIrrigation: async (): Promise<{ success: boolean; data: IrrigationData; message: string }> => {
    const response = await api.post('/irrigation/demo-toggle');
    return response.data;
  },
};
