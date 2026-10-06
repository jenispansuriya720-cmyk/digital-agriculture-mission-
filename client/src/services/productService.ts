import api from './api';
import { Product } from '../types';

export const productService = {
  getProducts: async (params?: { category?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string; featured?: boolean }): Promise<{
    success: boolean;
    data: Product[];
  }> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/products${query ? `?${query}` : ''}`);
    return response.data;
  },

  getProductById: async (id: string): Promise<{ success: boolean; data: Product }> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: Partial<Product>): Promise<{ success: boolean; data: Product; message: string }> => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<{ success: boolean; data: Product; message: string }> => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
