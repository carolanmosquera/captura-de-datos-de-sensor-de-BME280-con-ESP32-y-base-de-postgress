import { apiClient } from './apiClient';

export const cropService = {
  async getAll() {
    const response = await apiClient.get('/crops');
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/crops/${id}`);
    return response.data;
  },

  async create(data) {
    // data = { name, scientificName, description, isCentralNode, locationId }
    const response = await apiClient.post('/crops', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/crops/${id}`, data);
    return response.data;
  },

  async remove(id) {
    await apiClient.delete(`/crops/${id}`);
  },

  // Añadir al objeto cropService existente:
  async getByProperty(propertyId) {
    const response = await apiClient.get(`/crops/property/${propertyId}`);
    return response.data; // Devuelve solo los cultivos de esa propiedad
  },

  async getPlots(cropId) {
    const response = await apiClient.get(`/plots/crop/${cropId}`);
    return response.data; // Devuelve los lotes vinculados a este cultivo
  }
};