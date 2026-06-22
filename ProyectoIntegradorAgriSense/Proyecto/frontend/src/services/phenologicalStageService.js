import { apiClient } from './apiClient';

export const phenologicalStageService = {
  async getAll() {
    const response = await apiClient.get('/phenological-stages');
    return response.data;
  },
};