import { useState, useEffect } from 'react';
import styles from './PropertyFormModal.module.css';

export function PropertyFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    areaHectares: '',
    propertyTypeId: 1,
    locationId: 1,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          areaHectares: initialData.areaHectares || '',
          propertyTypeId: initialData.propertyTypeId || 1,
          locationId: initialData.locationId || 1,
        });
      } else {
        setFormData({
          name: '',
          areaHectares: '',
          propertyTypeId: 1,
          locationId: 1,
        });
      }
      setErrors({});
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.areaHectares) {
      newErrors.areaHectares = 'El área es obligatoria';
    } else if (parseFloat(formData.areaHectares) <= 0) {
      newErrors.areaHectares = 'El área debe ser mayor a cero';
    }
    if (!formData.locationId) newErrors.locationId = 'La ubicación es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      name: formData.name,
      areaHectares: parseFloat(formData.areaHectares),
      propertyTypeId: parseInt(formData.propertyTypeId),
      locationId: parseInt(formData.locationId),
      // slaveId ya no va aquí: el esclavo se asigna al Plot
    };

    onSubmit(submitData);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>{initialData ? 'Editar Propiedad' : 'Nueva Propiedad'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className={styles.field}>
            <label htmlFor="name">Nombre de la Propiedad *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Ej: Finca El Recreo"
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Área */}
          <div className={styles.field}>
            <label htmlFor="areaHectares">Área (Hectáreas) *</label>
            <input
              type="number"
              step="0.01"
              id="areaHectares"
              name="areaHectares"
              value={formData.areaHectares}
              onChange={handleChange}
              className={`${styles.input} ${errors.areaHectares ? styles.inputError : ''}`}
              placeholder="Ej: 5.5"
            />
            {errors.areaHectares && <span className={styles.errorText}>{errors.areaHectares}</span>}
          </div>

          {/* Tipo de propiedad */}
          <div className={styles.field}>
            <label htmlFor="propertyTypeId">Tipo de Propiedad</label>
            <select
              id="propertyTypeId"
              name="propertyTypeId"
              value={formData.propertyTypeId}
              onChange={handleChange}
              className={styles.input}
            >
              <option value={1}>Rural / Agrícola</option>
              <option value={2}>Ganadera</option>
              <option value={3}>Mixta</option>
            </select>
          </div>

          {/* Ubicación */}
          <div className={styles.field}>
            <label htmlFor="locationId">ID de Ubicación *</label>
            <input
              type="number"
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              className={`${styles.input} ${errors.locationId ? styles.inputError : ''}`}
              placeholder="Ej: 1"
              min="1"
            />
            {errors.locationId && <span className={styles.errorText}>{errors.locationId}</span>}
          </div>

          {/* Nota informativa */}
          <div className={styles.infoBox}>
            <span className={styles.infoIcon}>ℹ️</span>
            <p>
              Los nodos sensores (ESP32) ahora se asignan directamente a los <strong>Lotes</strong>,
              no a la propiedad. Crea o edita un lote para vincular un sensor.
            </p>
          </div>

          <footer className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn}>
              {initialData ? 'Guardar Cambios' : 'Crear Propiedad'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default PropertyFormModal;