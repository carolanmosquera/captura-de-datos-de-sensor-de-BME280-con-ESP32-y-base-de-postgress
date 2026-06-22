import { apiClient } from './apiClient'

export const mqttService = {
  
   //Envía un comando a un nodo específico
   //nodeId - ID del ESP32 receptor
   //action - "pause" o "resume"
   // {Promise<string>} - Mensaje de respuesta del servidor
   
  async sendCommandToNode(nodeId, action) {
    const response = await apiClient.post(`/commands/node/${nodeId}/${action}`)
    return response.data; // el backend responde con un texto
   
  },

  
   //Envía comando a todos los nodos
   //action - "pause" o "resume"
   
  async sendCommandToAll(action) {
    const response = await apiClient.post(`/commands/all/${action}`)
    return response.data
  }
};