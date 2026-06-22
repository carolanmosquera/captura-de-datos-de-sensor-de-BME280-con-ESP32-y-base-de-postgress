import { useState, useEffect } from 'react';
import { propertyService } from '../../services/propertyService';
import styles from './CropFormModal.module.css';

export default function CropFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    isCentralNode: false,
    locationId: '',
    propertyId: '',
  });
  const [error, setError] = useState('');
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadProperties = async () => {
        setLoadingProperties(true);
        try {
          const props = await propertyService.getAll();
          setProperties(props || []);
        } catch (err) {
          console.error('Error loading properties:', err);
        } finally {
          setLoadingProperties(false);
        }
      };
      loadProperties();

      if (initialData) {
        setFormData({
          name: initialData.name || '',
          scientificName: initialData.scientificName || '',
          description: initialData.description || '',
          isCentralNode: initialData.isCentralNode || false,
          locationId: initialData.locationId || '',
          propertyId: initialData.propertyId || '',
        });
      } else {
        setFormData({
          name: '',
          scientificName: '',
          description: '',
          isCentralNode: false,
          locationId: '',
          propertyId: '',
        });
      }
      setError('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'name' && value) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    const payload = {
      name: formData.name,
      scientificName: formData.scientificName || null,
      description: formData.description || null,
      isCentralNode: formData.isCentralNode,
      locationId: formData.locationId ? parseInt(formData.locationId) : null,
      propertyId: formData.propertyId ? parseInt(formData.propertyId) : null,
    };
    onSubmit(payload);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>{initialData ? 'Editar Cultivo' : 'Nuevo Cultivo'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className={styles.field}>
            <label htmlFor="name">Nombre *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ej: Maíz"
              autoFocus
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>

          {/* Nombre científico */}
          <div className={styles.field}>
            <label htmlFor="scientificName">Nombre Científico</label>
            <input
              type="text"
              id="scientificName"
              name="scientificName"
              value={formData.scientificName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ej: Zea mays"
            />
          </div>

          {/* Descripción */}
          <div className={styles.field}>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Breve descripción del cultivo..."
            />
          </div>

          {/* Propiedad asociada */}
          <div className={styles.field}>
            <label htmlFor="propertyId">Propiedad asociada</label>
            <select
              id="propertyId"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              className={styles.input}
              disabled={loadingProperties}
            >
              <option value="">-- Ninguna / Seleccione --</option>
              {properties.map(prop => (
                <option key={prop.id} value={prop.id}>
                  {prop.name}
                </option>
              ))}
            </select>
            <span className={styles.hint}>
              Opcional: vincular este cultivo a una propiedad específica.
            </span>
          </div>

          {/* Ubicación (locationId) */}
          <div className={styles.field}>
            <label htmlFor="locationId">ID de Ubicación</label>
            <input
              type="number"
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ej: 1"
              min="1"
            />
            <span className={styles.hint}>
              Asocia este cultivo (área/almacén) a una ubicación geográfica registrada.
            </span>
          </div>

          {/* Punto central de conexión */}
          <div className={styles.checkboxField}>
            <input
              type="checkbox"
              id="isCentralNode"
              name="isCentralNode"
              checked={formData.isCentralNode}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <div>
              <label htmlFor="isCentralNode" className={styles.checkboxLabel}>
                Punto central de conexión
              </label>
              <p className={styles.checkboxHint}>
                Activa si esta área contiene un lote con ESP-Master para extender la red de sensores.
              </p>
            </div>
          </div>

          <footer className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn}>
              {initialData ? 'Guardar Cambios' : 'Crear Cultivo'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}