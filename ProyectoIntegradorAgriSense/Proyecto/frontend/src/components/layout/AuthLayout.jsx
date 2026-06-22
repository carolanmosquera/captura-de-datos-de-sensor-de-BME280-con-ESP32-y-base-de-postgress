import styles from './AuthLayout.module.css';

export function AuthLayout({ children }) {
  return (
    <div className={styles.authLayout}>
      <main className={styles.authCard}>
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;