import styles from './AlertBadge.module.css';

/**
 * AlertBadge Component
 * Displays a styled badge based on alert severity.
 *
 * @param {Object} props
 * @param {('HIGH'|'MEDIUM'|'LOW')} props.severity - The severity level of the alert
 * @param {React.ReactNode} [props.children] - Optional text to override default severity label
 */
export function AlertBadge({ severity, children }) {
  const sev = severity?.toUpperCase() || 'LOW';
  
  const variantClass = styles[sev.toLowerCase()] || styles.low;

  return (
    <span className={`${styles.badge} ${variantClass}`}>
      {children || sev}
    </span>
  );
}

export default AlertBadge;
