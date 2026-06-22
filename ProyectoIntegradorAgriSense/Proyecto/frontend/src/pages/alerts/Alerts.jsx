import { useState, useEffect, useMemo } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import AlertBadge from '../../components/shared/AlertBadge';
import { alertService } from '../../services/alertService';
import styles from './Alerts.module.css';

export function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertService.getAll();
      setAlerts(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('No se pudieron cargar las alertas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(a => !filterSeverity || a.severity === filterSeverity)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [alerts, filterSeverity]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta alerta?')) return;
    
    try {
      await alertService.remove(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('Error al eliminar la alerta');
    }
  };

  const handleFilterChange = (severity) => {
    setFilterSeverity(severity);
  };

  const severityOptions = [
    { label: 'Todos', value: null },
    { label: 'HIGH', value: 'HIGH' },
    { label: 'MEDIUM', value: 'MEDIUM' },
    { label: 'LOW', value: 'LOW' }
  ];

  return (
    <AppLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gestión de Alertas</h1>
          <div className={styles.filterBar}>
            {severityOptions.map(option => (
              <button
                key={option.label}
                onClick={() => handleFilterChange(option.value)}
                className={`${styles.filterBtn} ${filterSeverity === option.value ? styles.activeFilter : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className={styles.loading}>Cargando alertas...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : alerts.length === 0 ? (
          <div className={styles.empty}>No hay alertas registradas</div>
        ) : filteredAlerts.length === 0 ? (
          <div className={styles.empty}>No hay alertas con el filtro seleccionado</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Severidad</th>
                  <th>Tipo</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map(alert => (
                  <tr key={alert.id}>
                    <td>
                      <AlertBadge severity={alert.severity} />
                    </td>
                    <td>{alert.type}</td>
                    <td className={styles.messageCell} title={alert.message}>
                      {alert.message}
                    </td>
                    <td>{new Date(alert.createdAt).toLocaleString()}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(alert.id)}
                        className={styles.deleteBtn}
                        title="Eliminar alerta"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default Alerts;
