import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import MetricCard from '../../components/shared/MetricCard';
import AlertBadge from '../../components/shared/AlertBadge';
import { useAuth } from '../../context/AuthContext';
import { telemetryService } from '../../services/telemetryService';
import { alertService } from '../../services/alertService';
import { cropService } from '../../services/cropService';
import { propertyService } from '../../services/propertyService';
import styles from './Home.module.css';

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Telemetry state
  const [telemetry, setTelemetry] = useState(null);
  const [telemetryLoading, setTelemetryLoading] = useState(true);
  const [telemetryError, setTelemetryError] = useState(null);

  // Alerts state
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState(null);

  // Properties state
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState(null);

  // Counts state
  const [cropCount, setCropCount] = useState(0);
  const [countsLoading, setCountsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setTelemetryLoading(true);
    setAlertsLoading(true);
    setPropertiesLoading(true);
    setCountsLoading(true);

    const results = await Promise.allSettled([
      telemetryService.getAll(),
      alertService.getAll(),
      cropService.getAll(),
      user?.id ? propertyService.getPropertiesByOwner(user.id) : Promise.resolve([])
    ]);

    // Handle Telemetry (Cálculo del promedio global)
    if (results[0].status === 'fulfilled') {
      
      const telemetryResponse = results[0].value;
      // Extraemos '.content' si viene paginado, o usamos la respuesta directa si es un arreglo normal
      const allTelemetryData = telemetryResponse?.content || telemetryResponse || [];

      if (allTelemetryData.length > 0) {
        // Sumamos las métricas de todos los registros devueltos
        const totalSum = allTelemetryData.reduce((acc, curr) => {
          return {
            temperature: acc.temperature + (curr.temperature || curr.temperatura || 0),
            humidity: acc.humidity + (curr.humidity || curr.humedad || 0),
            pressure: acc.pressure + (curr.pressure || curr.presion || 0),
            altitude: acc.altitude + (curr.altitude || curr.altitud || 0),
          };
        }, { temperature: 0, humidity: 0, pressure: 0, altitude: 0 });

        // Calculamos el promedio dividiendo entre el total de registros devueltos
        const globalAverages = {
          temperature: (totalSum.temperature / allTelemetryData.length).toFixed(1),
          humidity: (totalSum.humidity / allTelemetryData.length).toFixed(1),
          pressure: (totalSum.pressure / allTelemetryData.length).toFixed(1),
          altitude: (totalSum.altitude / allTelemetryData.length).toFixed(1),
        };

        setTelemetry(globalAverages);
      } else {
        setTelemetry(null);
      }
      setTelemetryError(null);
    } else {
      setTelemetryError(results[0].reason);
    }
    setTelemetryLoading(false);

    // Handle Crops Count
    if (results[2].status === 'fulfilled') {
      setCropCount(results[2].value?.length || 0);
    }

    // Handle Properties
    if (results[3].status === 'fulfilled') {
      setProperties(results[3].value || []);
      setPropertiesError(null);
    } else {
      setPropertiesError('No se pudieron cargar sus propiedades.');
    }
    setPropertiesLoading(false);
    setCountsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePropertyClick = (slaveId) => {
    if (slaveId) {
      navigate(`/sensors/${slaveId}`);
    }
  };

  const getPropertyTypeName = (typeId) => {
    const types = {
      1: 'Rural / Agrícola',
      2: 'Ganadera',
      3: 'Mixta'
    };
    return types[typeId] || 'Propiedad';
  };

  return (
    <AppLayout>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1 className={styles.sectionTitle}>Home</h1>
        </header>

        {/* KPI Metrics Section */}
        <section className={styles.metricsGrid}>
          <MetricCard
            title="Temperatura promedio"
            value={telemetry?.temperature || '--'}
            unit="°C"
            icon="🌡️"
            loading={telemetryLoading}
            error={telemetryError}
          />
          <MetricCard
            title="Humedad promedio"
            value={telemetry?.humidity || '--'}
            unit="%"
            icon="💧"
            loading={telemetryLoading}
            error={telemetryError}
          />
          <MetricCard
            title="Presión promedio"
            value={telemetry?.pressure || '--'}
            unit="hPa"
            icon="⏲️"
            loading={telemetryLoading}
            error={telemetryError}
          />
          <MetricCard
            title="Altitud promedio"
            value={telemetry?.altitude || '--'}
            unit="m"
            icon="🏔️"
            loading={telemetryLoading}
            error={telemetryError}
          />
        </section>

        {/* Mis Propiedades Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Mis Propiedades</h2>
          
          {propertiesLoading ? (
            <div className={styles.emptyState}>Cargando propiedades...</div>
          ) : propertiesError ? (
            <div className={styles.errorState}>{propertiesError}</div>
          ) : properties.length === 0 ? (
            <div className={styles.emptyState}>Aún no tienes propiedades registradas</div>
          ) : (
            <div className={styles.propertiesGrid}>
              {properties.map((property) => (
                <div 
                  key={property.id} 
                  className={styles.propertyCard}
                  onClick={() => handlePropertyClick(property.slaveId)}
                >
                  <div className={styles.propertyHeader}>
                    <span className={styles.propertyName}>{property.name}</span>
                    <span className={styles.propertyType}>
                      {getPropertyTypeName(property.propertyTypeId)}
                    </span>
                  </div>
                  <div className={styles.propertyInfo}>
                    <div className={styles.infoItem}>
                      📍 <span>Ubicación (ID): {property.locationId || 'N/A'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      📏 <span>{property.areaHectares} Hectáreas</span>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.summaryGrid}>
          <MetricCard
            title="Total Cultivos"
            value={cropCount}
            icon="🌱"
            loading={countsLoading}
          />
          <MetricCard
            title="Total Propiedades"
            value={properties.length}
            icon="🏡"
            loading={propertiesLoading}
          />
        </section>

        {/* Recent Alerts Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Alertas Recientes
            <button onClick={fetchData} className={styles.refreshBtn} title="Actualizar">⟳</button>
          </h2>

          {alertsLoading ? (
            <div className={styles.emptyState}>Cargando alertas...</div>
          ) : alertsError ? (
            <div className={styles.errorState}>Error al cargar alertas</div>
          ) : alerts.length === 0 ? (
            <div className={styles.emptyState}>Sin alertas activas</div>
          ) : (
            <div className={styles.alertsList}>
              {alerts.map((alert) => (
                <div key={alert.id} className={styles.alertItem}>
                  <div className={styles.alertContent}>
                    <span className={styles.alertMessage}>{alert.message}</span>
                    <span className={styles.alertDate}>
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <AlertBadge severity={alert.severity} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

export default Home;
