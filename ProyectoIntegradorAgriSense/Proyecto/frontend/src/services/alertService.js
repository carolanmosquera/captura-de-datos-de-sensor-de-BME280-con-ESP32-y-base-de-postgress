import { apiClient } from './apiClient';

export const alertService = {
  async getAll() {
    const response = await apiClient.get('/alerts');
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/alerts/${id}`);
    return response.data;
  },

  async getBySlave(slaveId) {
    const response = await apiClient.get(`/alerts/slave/${slaveId}`);
    return response.data;
  },

  // Nuevo: obtener alertas por condición de lote
  async getByPlotCondition(plotConditionId) {
    const response = await apiClient.get(`/alerts/plot-condition/${plotConditionId}`);
    return response.data;
  },

  async create(data) {
    // data debe incluir: type, severity, message, generatedBy, plotConditionId, slaveId, dataId?
    const response = await apiClient.post('/alerts', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/alerts/${id}`, data);
    return response.data;
  },

  async remove(id) {
    await apiClient.delete(`/alerts/${id}`);
  },
};