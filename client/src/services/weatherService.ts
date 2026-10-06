import api from './api';
import { WeatherData } from '../types';

export const weatherService = {
  getWeather: async (district?: string): Promise<{ success: boolean; data: WeatherData }> => {
    const url = district ? `/weather?district=${encodeURIComponent(district)}` : '/weather';
    const response = await api.get(url);
    return response.data;
  },
};
