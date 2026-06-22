import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import AppLayout from '../../components/layout/AppLayout';
import { iotService } from '../../services/iotService';
import styles from './NodeDetail.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

// ─── Cuántos registros mostrar ────────────────────────────────────────────────
const RECORDS_LIMIT = 20;
// ─── Intervalo de auto-refresco (ms). null = desactivado por defecto ──────────
const AUTO_REFRESH_MS = 10_000; // 10 s (2 ciclos de captura de 5 s)

export function NodeDetail() {
  const { slaveId } = useParams();
  const navigate = useNavigate();

  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // ─── Fetch de los últimos N registros del esclavo ─────────────────────────
  const fetchMeasurements = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      // Solicita exactamente los últimos RECORDS_LIMIT registros
      const raw = await iotService.getMeasurementsBySlave(slaveId, RECORDS_LIMIT);
      const data = Array.isArray(raw) ? raw : [];

      // Ordenar de más antiguo a más reciente para que la gráfica fluya izq→der
      const sorted = [...data]
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map((m) => {
          const d = new Date(m.timestamp);
          return {
            ...m,
            // Campos normalizados (el backend puede usar nombres distintos)
            temperature: m.temperature ?? m.temperatura ?? null,
            humidity:    m.humidity    ?? m.humedad    ?? null,
            pressure:    m.pressure    ?? m.presion    ?? null,
            altitude:    m.altitude    ?? m.altitud    ?? null,
            // Etiqueta de tiempo legible
            timeLabel: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            fullDateTime: d.toLocaleString(),
          };
        });

      setMeasurements(sorted);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error al obtener mediciones:', err);
      setError('No se pudieron cargar los datos del nodo. Verifica que el backend esté activo.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Carga inicial ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchMeasurements(true);
  }, [slaveId]);

  // ─── Auto-refresco ────────────────────────────────────────────────────────
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchMeasurements(false); // refresco silencioso (sin spinner)
      }, AUTO_REFRESH_MS);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, slaveId]);

  // ─── Datos derivados ──────────────────────────────────────────────────────
  const latest = measurements.length > 0 ? measurements[measurements.length - 1] : null;
  const labels  = measurements.map((m) => m.timeLabel);

  // ─── Configuración base de gráficas ──────────────────────────────────────
  const buildChartData = (key, label, color) => ({
    labels,
    datasets: [
      {
        label,
        // Usamos SOLO los valores del campo normalizado — datos reales del sensor
        data: measurements.map((m) => {
          const v = m[key];
          return v !== null && v !== undefined ? parseFloat(v) : null;
        }),
        borderColor: color,
        backgroundColor: color + '22',
        borderWidth: 2,
        pointRadius: measurements.length <= 10 ? 4 : 2,
        pointHoverRadius: 5,
        tension: 0.35,
        spanGaps: false, // no conectar nulos
      },
    ],
  });

  const chartOptions = (yLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0d1a13',
        titleColor: '#f0fdf4',
        bodyColor: '#9ca3af',
        borderColor: '#1f3d2a',
        borderWidth: 1,
        callbacks: {
          title: (items) => items[0]?.label ?? '',
          label: (item) =>
            item.raw !== null ? `${yLabel}: ${item.raw}` : 'Sin dato',
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#1f3d2a' },
        ticks: {
          color: '#6b7280',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
          font: { size: 10 },
        },
      },
      y: {
        grid: { color: '#1f3d2a' },
        ticks: { color: '#6b7280', font: { size: 10 } },
        title: {
          display: true,
          text: yLabel,
          color: '#6b7280',
          font: { size: 10 },
        },
      },
    },
  });

  const CHARTS = [
    { key: 'temperature', label: 'Temperatura (°C)', color: '#ef4444', unit: '°C' },
    { key: 'humidity',    label: 'Humedad (%)',       color: '#3b82f6', unit: '%'  },
    { key: 'pressure',    label: 'Presión (hPa)',     color: '#f59e0b', unit: 'hPa'},
    { key: 'altitude',    label: 'Altitud (m)',       color: '#a855f7', unit: 'm'  },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Navegación */}
        <button className={styles.backBtn} onClick={() => navigate('/sensors')}>
          ← Volver al explorador
        </button>

        {/* Cabecera */}
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <h1>Telemetría en tiempo real</h1>
            <p>Nodo Esclavo #{slaveId} — últimos {RECORDS_LIMIT} registros</p>
          </div>
          <div className={styles.controls}>
            <span className={styles.updatedAt}>
              {lastUpdated
                ? `Actualizado: ${lastUpdated.toLocaleTimeString()}`
                : 'Cargando...'}
            </span>
            <button
              className={`${styles.refreshToggle} ${autoRefresh ? styles.refreshActive : ''}`}
              onClick={() => setAutoRefresh((v) => !v)}
              title={autoRefresh ? 'Desactivar auto-refresco' : 'Activar auto-refresco'}
            >
              {autoRefresh ? '⏸ Auto-refresco ON' : '▶ Auto-refresco OFF'}
            </button>
            <button
              className={styles.manualRefresh}
              onClick={() => fetchMeasurements(true)}
              disabled={loading}
            >
              ⟳ Actualizar
            </button>
          </div>
        </header>

        {loading && measurements.length === 0 ? (
          <div className={styles.loading}>Cargando datos del sensor…</div>
        ) : error ? (
          <div className={styles.errorCard}>
            <p>{error}</p>
            <button onClick={() => fetchMeasurements(true)}>Reintentar</button>
          </div>
        ) : measurements.length === 0 ? (
          <div className={styles.emptyCard}>
            <h3>Sin datos disponibles</h3>
            <p>El nodo #{slaveId} no ha enviado mediciones aún.</p>
          </div>
        ) : (
          <div className={styles.dashboardLayout}>

            {/* ── KPIs: última lectura real ─────────────────────────────── */}
            <section className={styles.kpiGrid}>
              {CHARTS.map(({ key, label, color, unit }) => (
                <div
                  key={key}
                  className={styles.kpiCard}
                  style={{ borderLeft: `4px solid ${color}` }}
                >
                  <span className={styles.kpiLabel}>{label}</span>
                  <span className={styles.kpiValue} style={{ color }}>
                    {latest?.[key] !== null && latest?.[key] !== undefined
                      ? `${parseFloat(latest[key]).toFixed(1)} ${unit}`
                      : '—'}
                  </span>
                </div>
              ))}
              <div className={styles.kpiCard} style={{ borderLeft: '4px solid #1f3d2a' }}>
                <span className={styles.kpiLabel}>Última transmisión</span>
                <span className={styles.timeValue}>{latest?.fullDateTime ?? '—'}</span>
              </div>
            </section>

            {/* ── Gráficas + tabla ─────────────────────────────────────── */}
            <div className={styles.splitLayout}>

              {/* Gráficas — datos reales del sensor */}
              <div className={styles.chartsColumn}>
                {CHARTS.map(({ key, label, color, unit }) => (
                  <div key={key} className={styles.chartCard}>
                    <h4 style={{ color }}>{label}</h4>
                    <div className={styles.chartWrapper}>
                      <Line
                        data={buildChartData(key, label, color)}
                        options={chartOptions(unit)}
                      />
                    </div>
                    {/* Mini-estadísticas debajo de cada gráfica */}
                    <MiniStats data={measurements} field={key} unit={unit} />
                  </div>
                ))}
              </div>

              {/* Tabla de los últimos 20 registros */}
              <div className={styles.tableColumn}>
                <div className={styles.tableCard}>
                  <h3>
                    Últimos {measurements.length} registros
                    {loading && <span className={styles.loadingDot}> ●</span>}
                  </h3>
                  <div className={styles.tableScrollContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Hora</th>
                          <th>Temp °C</th>
                          <th>Hum %</th>
                          <th>Pres hPa</th>
                          <th>Alt m</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Tabla en orden inverso: más reciente arriba */}
                        {[...measurements].reverse().map((m, i) => (
                          <tr key={m.id ?? i} className={i === 0 ? styles.latestRow : ''}>
                            <td className={styles.mono}>{m.timeLabel}</td>
                            <td className={`${styles.mono} ${styles.tempText}`}>
                              {m.temperature !== null ? parseFloat(m.temperature).toFixed(1) : '—'}
                            </td>
                            <td className={`${styles.mono} ${styles.humidityText}`}>
                              {m.humidity !== null ? parseFloat(m.humidity).toFixed(1) : '—'}
                            </td>
                            <td className={`${styles.mono} ${styles.pressureText}`}>
                              {m.pressure !== null ? parseFloat(m.pressure).toFixed(1) : '—'}
                            </td>
                            <td className={`${styles.mono} ${styles.altitudeText}`}>
                              {m.altitude !== null ? parseFloat(m.altitude).toFixed(1) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// ─── Mini-estadísticas por gráfica ────────────────────────────────────────────
function MiniStats({ data, field, unit }) {
  const vals = data
    .map((m) => m[field])
    .filter((v) => v !== null && v !== undefined)
    .map(parseFloat);

  if (vals.length === 0) return null;

  const min = Math.min(...vals).toFixed(1);
  const max = Math.max(...vals).toFixed(1);
  const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);

  return (
    <div className={styles.miniStats}>
      <span data-label="↓ Mín">{min} {unit}</span>
      <span data-label="∅ Prom">{avg} {unit}</span>
      <span data-label="↑ Máx">{max} {unit}</span>
    </div>
  );
}

export default NodeDetail;