import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import MetricCard from '../../components/shared/MetricCard';
import { plotService } from '../../services/plotService';
import { iotService } from '../../services/iotService';
import { plotConditionService } from '../../services/plotConditionService';
import { PlotConditionsSection } from '../../components/plots/PlotConditionsSection';
import { PlotConditionFormModal } from '../../components/plots/PlotConditionFormModal';
import styles from './PlotDetail.module.css';

export function PlotDetail() {
  const { plotId } = useParams();
  const navigate = useNavigate();
  const [plot, setPlot] = useState(null);
  const [slaves, setSlaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [conditions, setConditions] = useState([]);
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);

  const [averages, setAverages] = useState({
    temperature: null,
    humidity: null,
    pressure: null,
    altitude: null,
  });
  const [averagesLoading, setAveragesLoading] = useState(true);

  useEffect(() => {
    const fetchPlotData = async () => {
      try {
        const plotData = await plotService.getById(plotId);
        setPlot(plotData);
        const slavesData = await iotService.getSlavesByPlot(plotId);
        setSlaves(slavesData);
        setError(null);
        await loadConditions(plotData.id);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la información del lote.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlotData();
  }, [plotId]);

  const loadConditions = async (id) => {
    try {
      const data = await plotConditionService.getByPlot(id);
      setConditions(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCondition = () => {
    setEditingCondition(null);
    setConditionModalOpen(true);
  };

  const handleEditCondition = (condition) => {
    setEditingCondition(condition);
    setConditionModalOpen(true);
  };

  const handleConditionSuccess = () => {
    if (plot) loadConditions(plot.id);
    setConditionModalOpen(false);
  };

  useEffect(() => {
    if (slaves.length === 0) {
      setAveragesLoading(false);
      return;
    }

    const fetchAllMeasurements = async () => {
      setAveragesLoading(true);
      let sumTemp = 0, sumHum = 0, sumPres = 0, sumAlt = 0;
      let count = 0;

      for (const slave of slaves) {
        try {
          const measurements = await iotService.getMeasurementsBySlave(slave.id, 100);
          if (measurements && measurements.length > 0) {
            measurements.forEach(m => {
              if (m.temperature != null) { sumTemp += m.temperature; count++; }
              if (m.humidity != null) sumHum += m.humidity;
              if (m.pressure != null) sumPres += m.pressure;
              if (m.altitude != null) sumAlt += m.altitude;
            });
          }
        } catch (err) {
          console.error(`Error en esclavo ${slave.id}:`, err);
        }
      }

      setAverages({
        temperature: count > 0 ? (sumTemp / count).toFixed(1) : null,
        humidity: count > 0 ? (sumHum / count).toFixed(1) : null,
        pressure: count > 0 ? (sumPres / count).toFixed(1) : null,
        altitude: count > 0 ? (sumAlt / count).toFixed(1) : null,
      });
      setAveragesLoading(false);
    };

    fetchAllMeasurements();
  }, [slaves]);

  if (loading) {
    return (
      <AppLayout>
        <div className={styles.loading}>Cargando detalles del lote...</div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className={styles.error}>{error}</div>
      </AppLayout>
    );
  }

  if (!plot) return null;

  return (
    <AppLayout>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate('/plots')}>
          ← Volver a lotes
        </button>

        <header className={styles.header}>
          <h1 className={styles.title}>{plot.name}</h1>
          <p className={styles.subtitle}>
            Área: {plot.area} m² | Cultivo: {plot.cropName || plot.cropId} | 
            Propiedad: {plot.propertyName || plot.propertyId}
          </p>
        </header>

        <section className={styles.metricsGrid}>
          <MetricCard title="Temperatura promedio" value={averages.temperature ?? '--'} unit="°C" icon="🌡️" loading={averagesLoading} />
          <MetricCard title="Humedad promedio" value={averages.humidity ?? '--'} unit="%" icon="💧" loading={averagesLoading} />
          <MetricCard title="Presión promedio" value={averages.pressure ?? '--'} unit="hPa" icon="⏲️" loading={averagesLoading} />
          <MetricCard title="Altitud promedio" value={averages.altitude ?? '--'} unit="m" icon="🏔️" loading={averagesLoading} />
        </section>

        <section className={styles.tableSection}>
          <h3>Promedios calculados (últimas mediciones)</h3>
          <div className={styles.tableContainer}>
            <table className={styles.averagesTable}>
              <thead><tr><th>Variable</th><th>Valor promedio</th><th>Unidad</th></tr></thead>
              <tbody>
                <tr><td>Temperatura</td><td>{averages.temperature ?? '--'}</td><td>°C</td></tr>
                <tr><td>Humedad</td><td>{averages.humidity ?? '--'}</td><td>%</td></tr>
                <tr><td>Presión</td><td>{averages.pressure ?? '--'}</td><td>hPa</td></tr>
                <tr><td>Altitud</td><td>{averages.altitude ?? '--'}</td><td>m</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Botón condicional */}
        {conditions.length === 0 ? (
          <button className={styles.addConditionBtn} onClick={handleAddCondition}>
            + Agregar condición
          </button>
        ) : (
          <button className={styles.editConditionBtn} onClick={() => handleEditCondition(conditions[0])}>
            ✏️ Editar condición
          </button>
        )}

        {!averagesLoading && (
          <PlotConditionsSection
            avgTemperature={averages.temperature ? parseFloat(averages.temperature) : null}
            avgHumidity={averages.humidity ? parseFloat(averages.humidity) : null}
            conditions={conditions}
            onEditCondition={handleEditCondition}
          />
        )}

        <section className={styles.slavesSection}>
          <h3>Nodos sensores en este lote</h3>
          {slaves.length === 0 ? (
            <div className={styles.emptyState}>No hay ESP32 esclavos asignados a este lote.</div>
          ) : (
            <div className={styles.slavesList}>
              {slaves.map(slave => (
                <div key={slave.id} className={styles.slaveCard}>
                  <div className={styles.slaveInfo}>
                    <span className={styles.slaveId}>Esclavo #{slave.id}</span>
                    <span className={styles.slaveStatus}>Estado: {slave.nodeStatus}</span>
                  </div>
                  <button className={styles.viewBtn} onClick={() => navigate(`/sensors/${slave.id}`)}>
                    Ver datos del nodo
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <PlotConditionFormModal
          isOpen={conditionModalOpen}
          onClose={() => setConditionModalOpen(false)}
          plotId={plot.id}
          initialData={editingCondition}
          onSuccess={handleConditionSuccess}
        />
      </div>
    </AppLayout>
  );
}