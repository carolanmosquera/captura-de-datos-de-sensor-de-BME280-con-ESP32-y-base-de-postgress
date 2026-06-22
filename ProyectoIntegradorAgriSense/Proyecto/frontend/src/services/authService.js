import { apiClient } from './apiClient'

export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  },

  async register({ name, email, password, phone }) {
    const response = await apiClient.post('/auth/register', { name, email, password, phone })
    return response.data
  },
}