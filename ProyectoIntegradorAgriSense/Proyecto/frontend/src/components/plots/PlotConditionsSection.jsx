import styles from './PlotConditionsSection.module.css';

export function PlotConditionsSection({ avgTemperature, avgHumidity, conditions, onEditCondition }) {
  if (!conditions || conditions.length === 0) return null;

  const isOutOfRange = (value, min, max) => value < min || value > max;

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Condiciones del Lote (Parámetros de referencia)</h3>
      <div className={styles.cards}>
        {conditions.map((cond) => {
          const tempOut = avgTemperature !== null ? isOutOfRange(avgTemperature, cond.minTemperature, cond.maxTemperature) : false;
          const humOut = avgHumidity !== null ? isOutOfRange(avgHumidity, cond.minHumidity, cond.maxHumidity) : false;
          const anyOut = tempOut || humOut;

          return (
            <div key={cond.id} className={`${styles.card} ${anyOut ? styles.cardAlert : ''}`}>
              <div className={styles.cardHeader}>
                <button onClick={() => onEditCondition(cond)} className={styles.editIcon} title="Editar condición">
                  ✏️
                </button>
                <span className={styles.stageName}>{cond.stageName || 'Etapa genérica'}</span>
                {anyOut && <span className={styles.alertBadge}>⚠️ Fuera de rango</span>}
              </div>
              <div className={styles.row}>
                <div className={styles.metric}>
                  <span>Temperatura óptima</span>
                  <strong>{cond.minTemperature}°C – {cond.maxTemperature}°C</strong>
                </div>
                <div className={`${styles.metric} ${tempOut ? styles.out : ''}`}>
                  <span>Promedio actual</span>
                  <strong>{avgTemperature !== null ? `${avgTemperature.toFixed(1)}°C` : '—'}</strong>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.metric}>
                  <span>Humedad óptima</span>
                  <strong>{cond.minHumidity}% – {cond.maxHumidity}%</strong>
                </div>
                <div className={`${styles.metric} ${humOut ? styles.out : ''}`}>
                  <span>Promedio actual</span>
                  <strong>{avgHumidity !== null ? `${avgHumidity.toFixed(1)}%` : '—'}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}