import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import styles from './Notifications.module.css';

export function Notifications() {
  const { user } = useAuth();
  const userId = user?.id;
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await notificationService.getByUser(userId);
      // Ordenar por fecha descendente
      const sorted = (data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sorted);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('No se pudieron cargar las notificaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const handleMarkRead = async (id, notification) => {
    try {
      await notificationService.markAsRead(id, notification);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, readStatus: 'read' } : n)
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta notificación?')) return;
    try {
      await notificationService.remove(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Notificaciones</h1>
        </header>

        {loading ? (
          <div className={styles.loading}>Cargando notificaciones...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : notifications.length === 0 ? (
          <div className={styles.empty}>No tienes notificaciones</div>
        ) : (
          <div className={styles.list}>
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`
                  ${styles.notificationItem} 
                  ${notification.readStatus !== 'read' ? styles.unread : styles.read}
                `}
              >
                <div className={styles.content}>
                  <p className={styles.message}>{notification.message}</p>
                  <span className={styles.date}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <div className={styles.actions}>
                  {notification.readStatus !== 'read' && (
                    <button 
                      className={`${styles.actionBtn} ${styles.markReadBtn}`}
                      onClick={() => handleMarkRead(notification.id, notification)}
                      title="Marcar como leída"
                    >
                      ✔️
                    </button>
                  )}
                  <button 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDelete(notification.id)}
                    title="Eliminar notificación"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default Notifications;
