import { useMqttController } from '../../hooks/useMqttController';
import styles from './MqttController.module.css';

function MqttController() {
  const {
    nodeId,
    setNodeId,
    loading,
    message,
    sendCommand,
    sendCommandToAll,
  } = useMqttController();

  return (
    <div className={styles.controller}>
      <h2>Controles de Dispositivo</h2>
      
      <div className={styles.inputGroup}>
        <label htmlFor="nodeId">ID del nodo</label>
        <input
          id="nodeId"
          type="number"
          value={nodeId}
          onChange={(e) => setNodeId(Number(e.target.value))}
          min="1"
          className={styles.input}
          placeholder="Ej: 1"
        />
      </div>

      <div className={styles.buttonGrid}>
        <button 
          className={styles.button} 
          onClick={() => sendCommand('pause')} 
          disabled={loading}
        >
          {loading ? '...' : 'Pausar Nodo'}
        </button>
        <button 
          className={styles.button} 
          onClick={() => sendCommand('resume')} 
          disabled={loading}
        >
          {loading ? '...' : 'Reanudar Nodo'}
        </button>
        <button 
          className={`${styles.button} ${styles.buttonSecondary}`} 
          onClick={() => sendCommandToAll('pause')} 
          disabled={loading}
        >
          {loading ? '...' : 'Pausar Todos'}
        </button>
        <button 
          className={`${styles.button} ${styles.buttonSecondary}`} 
          onClick={() => sendCommandToAll('resume')} 
          disabled={loading}
        >
          {loading ? '...' : 'Reanudar Todos'}
        </button>
      </div>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
}

export default MqttController;