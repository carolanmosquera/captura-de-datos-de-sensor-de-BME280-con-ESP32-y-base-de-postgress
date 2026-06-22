import { apiClient } from './apiClient'

export const userService = {
  async getAll() {
    const response = await apiClient.get('/users')
    return response.data
  },

  async getById(id) {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },

  async update(id, data) {
    const response = await apiClient.put(`/users/${id}`, data)
    return response.data
  },

  async remove(id) {
    await apiClient.delete(`/users/${id}`)
  },
}