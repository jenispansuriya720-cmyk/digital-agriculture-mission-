import api from './api';
import { Article } from '../types';

export const articleService = {
  getArticles: async (params?: { category?: string; search?: string; featured?: boolean }): Promise<{ success: boolean; data: Article[] }> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/articles${query ? `?${query}` : ''}`);
    return response.data;
  },

  getArticle: async (slug: string): Promise<{ success: boolean; data: Article }> => {
    const response = await api.get(`/articles/${slug}`);
    return response.data;
  },

  createArticle: async (articleData: Partial<Article>): Promise<{ success: boolean; data: Article; message: string }> => {
    const response = await api.post('/articles', articleData);
    return response.data;
  },

  updateArticle: async (id: string, articleData: Partial<Article>): Promise<{ success: boolean; data: Article; message: string }> => {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data;
  },

  deleteArticle: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },
};
