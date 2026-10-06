import api from './api';
import { User } from '../types';

export const authService = {
  register: async (userData: any): Promise<{ success: boolean; data: User; message: string }> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { emailOrMobile: string; password: string }): Promise<{ success: boolean; data: User; message: string }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async (): Promise<{ success: boolean; data: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<{ success: boolean; data: User; message: string }> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (passwords: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.put('/auth/change-password', passwords);
    return response.data;
  },
};
