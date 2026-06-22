import { apiClient } from './apiClient'

export const telemetryService = {
  async getAll(params = {}) {
    const response = await apiClient.get('/rest/telemetry', { params })
    return response.data
  },

  async getLast10ByNode(nodeId) {
    const response = await apiClient.get(`/rest/telemetry/last10/${nodeId}`)
    return response.data
  },

  async getLastByNode(nodeId) {
    const response = await apiClient.get(`/rest/telemetry/last/${nodeId}`)
    return response.data
  },
}