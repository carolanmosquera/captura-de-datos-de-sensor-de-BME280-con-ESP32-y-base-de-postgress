import { useState } from 'react';
import { mqttService } from '../services/mqttService';

export function useMqttController() {
  const [nodeId, setNodeId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendCommand = async (action) => {
    setLoading(true);
    setMessage('');
    try {
      const responseText = await mqttService.sendCommandToNode(nodeId, action);
      setMessage(`Comando "${action}" enviado: ${responseText}`);
    } catch (err) {
      setMessage(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendCommandToAll = async (action) => {
    setLoading(true);
    setMessage('');
    try {
      const responseText = await mqttService.sendCommandToAll(action);
      setMessage(` Comando "${action}" a TODOS: ${responseText}`);
    } catch (err) {
      setMessage(` ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    nodeId,
    setNodeId,
    loading,
    message,
    sendCommand,
    sendCommandToAll,
  };
}