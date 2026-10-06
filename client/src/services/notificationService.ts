import api from './api';
import { NotificationItem } from '../types';

export const notificationService = {
  getMyNotifications: async (): Promise<{ success: boolean; data: NotificationItem[]; unreadCount: number }> => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<{ success: boolean; data: NotificationItem }> => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
};
