import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import styles from './Profile.module.css';

export function Profile() {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (message) setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const updatedData = {
        name: formData.name,
        phone: formData.phone
      };
      
      const result = await userService.update(user.id, updatedData);
      
      // Update global context
      updateUser(result);
      
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Mi Perfil</h1>
        
        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="name">Nombre Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Tu nombre"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Teléfono</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                placeholder="Tu número de teléfono"
              />
            </div>

            {message && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            <div className={styles.footer}>
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;
