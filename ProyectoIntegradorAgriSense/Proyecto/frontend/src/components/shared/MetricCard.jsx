import styles from './MetricCard.module.css';

/**
 * MetricCard Component
 * Displays a single KPI metric with support for loading and error states.
 *
 * @param {Object} props
 * @param {string} props.title - The title of the metric
 * @param {string|number} props.value - The numerical or text value
 * @param {string} props.unit - The unit of measurement (e.g., °C, %)
 * @param {string} props.icon - Icon to display (emoji or text)
 * @param {boolean} props.loading - If true, shows a skeleton loader
 * @param {any} props.error - If not null, shows "Sin datos"
 */
export function MetricCard({ title, value, unit, icon, loading, error }) {
  if (loading) {
    return (
      <div className={`${styles.card} ${styles.skeleton}`}>
        <div className={styles.header}>
          <div className={styles.skeletonTitle} />
          {icon && <span className={styles.icon}>{icon}</span>}
        </div>
        <div className={styles.skeletonValue} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </header>

      <div className={styles.body}>
        {error ? (
          <span className={styles.error}>Sin datos</span>
        ) : (
          <>
            <span className={styles.value}>{value}</span>
            {unit && <span className={styles.unit}>{unit}</span>}
          </>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
