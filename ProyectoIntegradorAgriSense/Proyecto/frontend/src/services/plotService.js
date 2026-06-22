import { apiClient } from './apiClient';

export const plotService = {
  async getAll() {
    const response = await apiClient.get('/plots');
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/plots/${id}`);
    return response.data;
  },

  async getByProperty(propertyId) {
    const response = await apiClient.get(`/plots/property/${propertyId}`);
    return response.data;
  },

  async create(data) {
    // data = { name, area, propertyId, cropId, hasMaster }
    // locationId ya NO se envía en Plot (se mudó a Crop)
    const response = await apiClient.post('/plots', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/plots/${id}`, data);
    return response.data;
  },

  async remove(id) {
    await apiClient.delete(`/plots/${id}`);
  },

  
};