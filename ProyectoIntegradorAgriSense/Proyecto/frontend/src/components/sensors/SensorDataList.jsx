import { useState, useEffect } from 'react';
import { useSensorData } from '../../hooks/useSensorData';
import { iotService } from '../../services/iotService';
import styles from './SensorDataList.module.css';

function SensorDataList() {
  const { 
    data, 
    loading, 
    error, 
    filters, 
    totalPages, 
    updateFilters, 
    nextPage, 
    prevPage, 
    refetch 
  } = useSensorData();

  const [masters, setMasters] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]);

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [mastersData, typesData] = await Promise.all([
          iotService.getMasters(),
          iotService.getSensorTypes()
        ]);
        setMasters(mastersData);
        setSensorTypes(typesData);
      } catch (err) {
        console.error('Error loading filter options:', err);
      }
    };
    loadFilterData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  const handleReset = () => {
    updateFilters({
      nodeId: '',
      sensorType: '',
      startDate: '',
      endDate: '',
      page: 1
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Registros de Telemetría</h2>
        <button onClick={refetch} className={`${styles.button} ${styles.buttonOutline}`}>
          <span>⟳</span> Actualizar
        </button>
      </header>

      <section className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="nodeId">Nodo (Master)</label>
          <select 
            id="nodeId" 
            name="nodeId" 
            value={filters.nodeId || ''} 
            onChange={handleFilterChange}
            className={styles.select}
          >
            <option value="">Todos los nodos</option>
            {masters.map(m => (
              <option key={m.id} value={m.id}>{m.nombre || `Master ${m.id}`}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="sensorType">Tipo de Sensor</label>
          <select 
            id="sensorType" 
            name="sensorType" 
            value={filters.sensorType || ''} 
            onChange={handleFilterChange}
            className={styles.select}
          >
            <option value="">Todos los tipos</option>
            {sensorTypes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="startDate">Desde</label>
          <input 
            type="date" 
            id="startDate" 
            name="startDate" 
            value={filters.startDate || ''} 
            onChange={handleFilterChange}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="endDate">Hasta</label>
          <input 
            type="date" 
            id="endDate" 
            name="endDate" 
            value={filters.endDate || ''} 
            onChange={handleFilterChange}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup} style={{ justifyContent: 'flex-end' }}>
          <button onClick={handleReset} className={`${styles.button} ${styles.buttonOutline}`}>
            Limpiar Filtros
          </button>
        </div>
      </section>

      {loading ? (
        <div className={styles.loading}>Cargando datos de sensores...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Node ID</th>
                  <th>Temperatura</th>
                  <th>Humedad</th>
                  <th>Presión</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.nodeId}</td>
                    <td>{item.temperature} °C</td>
                    <td>{item.humidity} %</td>
                    <td>{item.pressure} hPa</td>
                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="6" className={styles.empty}>No hay datos disponibles para los filtros seleccionados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Mostrando página {filters.page} de {totalPages || 1}
            </div>
            <div className={styles.paginationControls}>
              <div className={styles.filterGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <label>Tamaño:</label>
                <select 
                  name="size" 
                  value={filters.size} 
                  onChange={handleFilterChange}
                  className={styles.select}
                  style={{ width: '70px' }}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <button 
                onClick={prevPage} 
                disabled={filters.page <= 1}
                className={styles.button}
              >
                Anterior
              </button>
              <button 
                onClick={nextPage} 
                disabled={filters.page >= totalPages}
                className={styles.button}
              >
                Siguiente
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default SensorDataList;