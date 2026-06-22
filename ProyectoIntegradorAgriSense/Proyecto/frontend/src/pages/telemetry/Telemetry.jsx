import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { telemetryService } from '../../services/telemetryService';
import styles from './Telemetry.module.css';

export function Telemetry() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para controlar la paginación
  const [page, setPage] = useState(0);             // Spring Boot empieza en la página 0
  const [totalPages, setTotalPages] = useState(0); // Total de páginas que calcula el servidor
  const [pageSize] = useState(10);                 // Cantidad de filas por página

  // 1. Convertimos la petición en una función normal fuera de useCallback
  const fetchTelemetry = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pasamos la página actual y el tamaño al servicio
      const response = await telemetryService.getAll({ page: page, size: pageSize });
      
      if (response && response.content) {
        // Formato estándar de Spring Boot Page
        setData(response.content);
        setTotalPages(response.totalPages);
      } else {
        // Fallback por si el backend devuelve un arreglo plano
        setData(response || []);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching telemetry:', err);
      setError('No se pudieron cargar los datos de telemetría.');
    } finally {
      setLoading(false);
    }
  };

  // 2. El useEffect observa DIRECTAMENTE a la variable de estado 'page'
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTelemetry();
    }, 0);

    // Limpiamos el timer si el componente se desmonta rápido
    return () => clearTimeout(timer);
  }, [page]);

  return (
    <AppLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Historial de Telemetría</h1>
          <button 
            className={styles.refreshBtn} 
            onClick={fetchTelemetry}
            disabled={loading}
          >
            <span>⟳</span> {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </header>

        {loading && data.length === 0 ? (
          <div className={styles.loading}>Cargando registros de telemetría...</div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <button className={styles.retryBtn} onClick={fetchTelemetry}>Reintentar</button>
          </div>
        ) : data.length === 0 ? (
          <div className={styles.empty}>No hay registros de telemetría</div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Node</th>
                    <th>Temp (°C)</th>
                    <th>Hum (%)</th>
                    <th>Pres (hPa)</th>
                    <th>Alt (m)</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td className={styles.mono}>{item.id}</td>
                      <td className={styles.mono}>{item.nodeId || item.slave?.id || '--'}</td>
                      <td className={styles.mono}>{item.temperature || item.temperatura || '--'}</td>
                      <td className={styles.mono}>{item.humidity || item.humedad || '--'}</td>
                      <td className={styles.mono}>{item.pressure || item.presion || '--'}</td>
                      <td className={styles.mono}>{item.altitude || item.altitud || '--'}</td>
                      <td className={styles.mono}>{new Date(item.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            <div className={styles.paginationContainer}>
              <button 
                className={styles.pageBtn} 
                onClick={() => setPage(0)} 
                disabled={page === 0 || loading}
              >
                « Primero
              </button>
              <button 
                className={styles.pageBtn} 
                onClick={() => setPage(prev => Math.max(0, prev - 1))} 
                disabled={page === 0 || loading}
              >
                ‹ Anterior
              </button>
              
              <span className={styles.pageInfo}>
                Página <strong>{page + 1}</strong> de <strong>{totalPages || 1}</strong>
              </span>

              <button 
                className={styles.pageBtn} 
                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))} 
                disabled={page >= totalPages - 1 || loading}
              >
                Siguiente ›
              </button>
              <button 
                className={styles.pageBtn} 
                onClick={() => setPage(totalPages - 1)} 
                disabled={page >= totalPages - 1 || loading}
              >
                Último »
              </button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default Telemetry;