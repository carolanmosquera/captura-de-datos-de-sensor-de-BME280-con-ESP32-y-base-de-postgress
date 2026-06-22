import { apiClient } from './apiClient'

export const iotService = {
  async getMasters() {
    const response = await apiClient.get('/master')
    return response.data
  },

  async getSlavesByMaster(masterId) {
    const response = await apiClient.get(`/slave/masters/${masterId}`)
    return response.data
  },

  async getSensorsBySlave(slaveId) {
    const response = await apiClient.get(`/sensor/slaves/${slaveId}`)
    return response.data
  },

  async getSensorTypes() {
    const response = await apiClient.get('/sensor/sensor-types')
    return response.data
  },

  async getMeasurementsBySlave(slaveId, limit = 20) {
    const response = await apiClient.get(`/measurement/slaves/${slaveId}?limit=${limit}`)
    return response.data
  },

  // Esclavos sin plot asignado y activos → endpoint correcto del backend
  async getAvailableSlaves() {
    const response = await apiClient.get('/slave/available')
    return response.data
  },

  // Asignar un esclavo a un plot → endpoint correcto del backend
  async assignSlaveToPlot(slaveId, plotId) {
    const response = await apiClient.patch(`/slave/${slaveId}/assign-plot`, { plotId })
    return response.data
  },

  //Traer slaves por sector
  async getSlavesByPlot(plotId) {
    const response = await apiClient.get(`/slave/plot/${plotId}`);
    return response.data;
  }
}