import AppLayout from '../../components/layout/AppLayout';
import MqttController from '../../components/mqtt/MqttController';
import styles from './MqttPage.module.css';

export function MqttPage() {
  return (
    <AppLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Control MQTT</h1>
          <p>Gestión remota de nodos IoT en tiempo real</p>
        </header>

        <section className={styles.panel}>
          <div className={styles.instructions}>
            <h2>Instrucciones de Uso</h2>
            <p>
              Desde este panel puedes enviar comandos directos a los nodos esclavos 
              a través del protocolo MQTT. Estos comandos permiten controlar el 
              flujo de datos de telemetría.
            </p>
            <ul>
              <li><strong>Pausar:</strong> Detiene el envío de datos del nodo especificado.</li>
              <li><strong>Reanudar:</strong> Reactiva el envío de datos del nodo especificado.</li>
              <li><strong>Comandos Globales:</strong> Afectan a todos los nodos conectados simultáneamente.</li>
            </ul>
            <p>
              Asegúrate de ingresar el ID correcto del nodo antes de enviar un comando individual. 
              El sistema confirmará la recepción del comando una vez procesado por el servidor.
            </p>
          </div>

          <div className={styles.controllerWrapper}>
            <MqttController />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default MqttPage;
