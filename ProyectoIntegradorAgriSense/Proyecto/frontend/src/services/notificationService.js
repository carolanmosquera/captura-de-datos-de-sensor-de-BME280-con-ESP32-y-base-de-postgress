import { apiClient } from './apiClient'

export const notificationService = {
  async getAll() {
    const response = await apiClient.get('/notifications')
    return response.data
  },

  async getByUser(userId) {
    const response = await apiClient.get(`/notifications/user/${userId}`)
    return response.data
  },

  async markAsRead(id, notificationData) {
    const response = await apiClient.put(`/notifications/${id}`, {
      ...notificationData,
      readStatus: 'read',
    })
    return response.data
  },

  async remove(id) {
    await apiClient.delete(`/notifications/${id}`)
  },
}