import { apiClient } from './apiClient';

export const propertyService = {
  async getAll() {
    const response = await apiClient.get('/properties');
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },

  async getPropertiesByOwner(ownerId) {
    const response = await apiClient.get(`/properties/owner/${ownerId}`);
    return response.data;
  },

  async create(data) {
    // data = { name, ownerId, propertyTypeId, areaHectares, locationId }
    // slaveId ya NO se envía: los esclavos se asignan al Plot, no a la Propiedad
    const { slaveId, ...cleanData } = data; // descartamos slaveId si llega por accidente
    const response = await apiClient.post('/properties', cleanData);
    return response.data;
  },

  async update(id, data) {
    const { slaveId, ...cleanData } = data;
    const response = await apiClient.put(`/properties/${id}`, cleanData);
    return response.data;
  },

  async remove(id) {
    await apiClient.delete(`/properties/${id}`);
  },
};