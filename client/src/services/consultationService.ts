import api from './api';
import { Consultation } from '../types';

export const consultationService = {
  createConsultation: async (consultationData: any): Promise<{ success: boolean; data: Consultation; message: string }> => {
    const response = await api.post('/consultations', consultationData);
    return response.data;
  },

  getMyConsultations: async (): Promise<{ success: boolean; data: Consultation[] }> => {
    const response = await api.get('/consultations');
    return response.data;
  },

  replyConsultation: async (id: string, replyData: { advice: string; suggestedTreatment?: string; expertName?: string }): Promise<{
    success: boolean;
    data: Consultation;
    message: string;
  }> => {
    const response = await api.put(`/consultations/${id}/reply`, replyData);
    return response.data;
  },
};
