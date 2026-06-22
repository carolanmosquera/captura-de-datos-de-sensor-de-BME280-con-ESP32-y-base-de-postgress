import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AppLayout.module.css';

export function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/home', label: 'Home' },
    { path: '/crops', label: 'Cultivos' },
    { path: '/properties', label: 'Propiedades' },
    { path: '/plots', label: 'Lotes' },         // ← nueva ruta
    { path: '/sensors', label: 'Sensores' },
    { path: '/telemetry', label: 'Telemetría' },
    { path: '/alerts', label: 'Alertas' },
    { path: '/notifications', label: 'Notificaciones' },
    { path: '/mqtt', label: 'MQTT' },
    { path: '/profile', label: 'Perfil' },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.logo}>AGRISENSE</span>
        </div>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <header className={styles.topbar}>
        <div className={styles.appName}>Gestión Agrícola</div>
        <div className={styles.userMenu}>
          <span className={styles.userName}>{user?.name || 'Usuario'}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;