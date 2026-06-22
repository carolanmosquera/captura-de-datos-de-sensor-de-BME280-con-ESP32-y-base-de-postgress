import { apiClient } from './apiClient';

export const plotConditionService = {
  async getAll() {
    const response = await apiClient.get('/plot-conditions');
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/plot-conditions/${id}`);
    return response.data;
  },

  async getByPlot(plotId) {
    const response = await apiClient.get(`/plot-conditions/plot/${plotId}`);
    return response.data;
  },

  async create(data) {
    // data = { plotId, minTemperature, maxTemperature, minHumidity, maxHumidity, stageId }
    const response = await apiClient.post('/plot-conditions', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/plot-conditions/${id}`, data);
    return response.data;
  },

  async remove(id) {
    await apiClient.delete(`/plot-conditions/${id}`);
  },
};