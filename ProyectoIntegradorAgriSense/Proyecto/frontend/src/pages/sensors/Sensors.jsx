import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { iotService } from '../../services/iotService';
import styles from './Sensors.module.css';

// Garantiza que siempre trabajamos con un array sin importar la forma de la respuesta
function toArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.content)) return data.content; // Spring Page
  if (Array.isArray(data.data)) return data.data;
  return [];
}

export function Sensors() {
  const navigate = useNavigate();
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [slaves, setSlaves] = useState([]);
  const [slavesLoading, setSlavesLoading] = useState(false);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const data = await iotService.getMasters();
        setMasters(toArray(data));
      } catch (err) {
        console.error('Error fetching masters:', err);
        setError('No se pudieron cargar los controladores master.');
      } finally {
        setLoading(false);
      }
    };
    fetchMasters();
  }, []);

  const handleSelectMaster = async (masterId) => {
    if (selectedMaster === masterId) {
      setSelectedMaster(null);
      setSlaves([]);
      return;
    }

    setSelectedMaster(masterId);
    setSlavesLoading(true);
    try {
      const data = await iotService.getSlavesByMaster(masterId);
      setSlaves(toArray(data));
    } catch (err) {
      console.error('Error fetching slaves:', err);
      setSlaves([]);
    } finally {
      setSlavesLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <header>
          <h1 className={styles.title}>Explorador de Nodos IoT</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            Navega por la jerarquía de controladores Master y sus nodos esclavos asociados.
          </p>
        </header>

        {loading ? (
          <div className={styles.loading}>Cargando controladores master...</div>
        ) : error ? (
          <div className={styles.loading} style={{ color: 'var(--color-danger-500)' }}>{error}</div>
        ) : masters.length === 0 ? (
          <div className={styles.empty}>No hay controladores master registrados.</div>
        ) : (
          <div className={styles.masterList}>
            {masters.map((master) => (
              <div key={master.id} className={styles.masterCard}>
                <div
                  className={styles.masterHeader}
                  onClick={() => handleSelectMaster(master.id)}
                >
                  <div className={styles.masterInfo}>
                    <span className={styles.masterIcon}>🛰️</span>
                    <div>
                      <div className={styles.masterName}>
                        Master #{master.id} — MAC: {master.mac?.slice(-8) || 'N/A'}
                      </div>
                      <div className={styles.masterId}>Canal: {master.canal ?? '?'}</div>
                    </div>
                  </div>
                  <span className={`${styles.chevron} ${selectedMaster === master.id ? styles.chevronOpen : ''}`}>
                    ▼
                  </span>
                </div>

                {selectedMaster === master.id && (
                  <div className={styles.slaveSection}>
                    {slavesLoading ? (
                      <div className={styles.loading}>Buscando nodos esclavos...</div>
                    ) : slaves.length === 0 ? (
                      <div className={styles.empty}>Sin nodos esclavos registrados</div>
                    ) : (
                      <div className={styles.slaveGrid}>
                        {slaves.map((slave) => (
                          <div
                            key={slave.id}
                            className={styles.slaveCard}
                            onClick={() => navigate(`/sensors/${slave.id}`)}
                          >
                            <div className={styles.slaveName}>
                              <span className={`${styles.statusIndicator} ${styles.statusOnline}`}></span>
                              Slave #{slave.id}
                            </div>
                            <div className={styles.slaveMeta}>Estado: {slave.nodeStatus || 'N/A'}</div>
                            <div className={styles.slaveMeta}>
                              Plot: {slave.plotId ? `#${slave.plotId}` : 'Sin asignar'}
                              {slave.plotName && <span> ({slave.plotName})</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default Sensors;