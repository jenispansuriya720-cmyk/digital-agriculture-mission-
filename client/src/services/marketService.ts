import api from './api';
import { MarketPrice } from '../types';

export const marketService = {
  getMarketPrices: async (params?: { crop?: string; market?: string; district?: string; state?: string; sort?: string }): Promise<{
    success: boolean;
    data: MarketPrice[];
    meta?: {
      topGainers: MarketPrice[];
      bestMarket: MarketPrice | null;
    };
  }> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/market${query ? `?${query}` : ''}`);
    return response.data;
  },

  createMarketPrice: async (priceData: Partial<MarketPrice>): Promise<{ success: boolean; data: MarketPrice; message: string }> => {
    const response = await api.post('/market', priceData);
    return response.data;
  },

  updateMarketPrice: async (id: string, priceData: Partial<MarketPrice>): Promise<{ success: boolean; data: MarketPrice; message: string }> => {
    const response = await api.put(`/market/${id}`, priceData);
    return response.data;
  },

  deleteMarketPrice: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/market/${id}`);
    return response.data;
  },
};
