import { useState, useEffect } from 'react';
import { iotService } from '../../services/iotService';
import styles from './PlotFormModal.module.css';

export function PlotFormModal({ isOpen, onClose, onSubmit, initialData, crops = [], properties = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    propertyId: '',
    cropId: '',
    hasMaster: false,
  });
  const [errors, setErrors] = useState({});

  // Estado para asignación de esclavo (post-creación)
  const [availableSlaves, setAvailableSlaves] = useState([]);
  const [loadingSlaves, setLoadingSlaves] = useState(false);
  const [selectedSlaveId, setSelectedSlaveId] = useState('');
  const [assigningSlave, setAssigningSlave] = useState(false);
  const [assignMessage, setAssignMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableSlaves();
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          area: initialData.area || '',
          propertyId: initialData.propertyId || '',
          cropId: initialData.cropId || '',
          hasMaster: initialData.hasMaster || false,
        });
      } else {
        setFormData({ name: '', area: '', propertyId: '', cropId: '', hasMaster: false });
      }
      setErrors({});
      setSelectedSlaveId('');
      setAssignMessage(null);
    }
  }, [initialData, isOpen]);

  const fetchAvailableSlaves = async () => {
    setLoadingSlaves(true);
    try {
      const slaves = await iotService.getAvailableSlaves();
      setAvailableSlaves(slaves || []);
    } catch (err) {
      console.error('Error fetching available slaves:', err);
      setAvailableSlaves([]);
    } finally {
      setLoadingSlaves(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.area) newErrors.area = 'El área es obligatoria';
    else if (parseFloat(formData.area) <= 0) newErrors.area = 'El área debe ser mayor a cero';
    if (!formData.propertyId) newErrors.propertyId = 'Seleccione una propiedad';
    if (!formData.cropId) newErrors.cropId = 'Seleccione un cultivo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: formData.name,
      area: parseFloat(formData.area),
      propertyId: parseInt(formData.propertyId),
      cropId: parseInt(formData.cropId),
      hasMaster: formData.hasMaster,
    });
  };

  const handleAssignSlave = async () => {
    if (!selectedSlaveId || !initialData?.id) return;
    setAssigningSlave(true);
    setAssignMessage(null);
    try {
      await iotService.assignSlaveToPlot(parseInt(selectedSlaveId), initialData.id);
      setAssignMessage({ type: 'success', text: `Nodo #${selectedSlaveId} asignado correctamente.` });
      fetchAvailableSlaves(); // refrescar lista
      setSelectedSlaveId('');
    } catch (err) {
      setAssignMessage({ type: 'error', text: 'Error al asignar el nodo. Intenta de nuevo.' });
    } finally {
      setAssigningSlave(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>{initialData ? 'Editar Lote' : 'Nuevo Lote'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className={styles.field}>
            <label htmlFor="name">Nombre del Lote *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Ej: Sector A"
              autoFocus
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Área */}
          <div className={styles.field}>
            <label htmlFor="area">Área (m²) *</label>
            <input
              type="number"
              step="0.01"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className={`${styles.input} ${errors.area ? styles.inputError : ''}`}
              placeholder="Ej: 500"
            />
            {errors.area && <span className={styles.errorText}>{errors.area}</span>}
          </div>

          {/* Propiedad */}
          <div className={styles.field}>
            <label htmlFor="propertyId">Propiedad *</label>
            <select
              id="propertyId"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              className={`${styles.input} ${errors.propertyId ? styles.inputError : ''}`}
            >
              <option value="">-- Seleccione una propiedad --</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {errors.propertyId && <span className={styles.errorText}>{errors.propertyId}</span>}
          </div>

          {/* Cultivo */}
          <div className={styles.field}>
            <label htmlFor="cropId">Cultivo (Área) *</label>
            <select
              id="cropId"
              name="cropId"
              value={formData.cropId}
              onChange={handleChange}
              className={`${styles.input} ${errors.cropId ? styles.inputError : ''}`}
            >
              <option value="">-- Seleccione un cultivo --</option>
              {crops.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.cropId && <span className={styles.errorText}>{errors.cropId}</span>}
          </div>

          {/* ¿Tiene ESP-Master? */}
          <div className={styles.checkboxField}>
            <input
              type="checkbox"
              id="hasMaster"
              name="hasMaster"
              checked={formData.hasMaster}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <div>
              <label htmlFor="hasMaster" className={styles.checkboxLabel}>
                ¿Este lote tiene un ESP-Master?
              </label>
              <p className={styles.checkboxHint}>
                Activa si este sector actúa como nodo central para extender la red de sensores.
              </p>
            </div>
          </div>

          <footer className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn}>
              {initialData ? 'Guardar Cambios' : 'Crear Lote'}
            </button>
          </footer>
        </form>

        {/* Sección de asignación de esclavo — solo visible al editar un lote existente */}
        {initialData?.id && (
          <div className={styles.slaveSection}>
            <h3 className={styles.slaveTitle}>Asignar Nodo Sensor (ESP32-Slave)</h3>
            <p className={styles.slaveDesc}>
              Selecciona un nodo disponible para vincularlo a este lote.
            </p>

            <div className={styles.slaveRow}>
              <select
                value={selectedSlaveId}
                onChange={e => setSelectedSlaveId(e.target.value)}
                className={styles.input}
                disabled={loadingSlaves}
              >
                <option value="">-- Seleccione un nodo disponible --</option>
                {availableSlaves.map(slave => (
                  <option key={slave.id} value={slave.id}>
                    Nodo #{slave.id} — Estado: {slave.nodeStatus}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.assignBtn}
                onClick={handleAssignSlave}
                disabled={!selectedSlaveId || assigningSlave}
              >
                {assigningSlave ? '...' : 'Asignar'}
              </button>
            </div>

            {loadingSlaves && (
              <p className={styles.slaveHint}>Cargando nodos disponibles...</p>
            )}
            {!loadingSlaves && availableSlaves.length === 0 && (
              <p className={styles.slaveHint}>No hay nodos sin asignar en estado activo.</p>
            )}

            {assignMessage && (
              <div className={`${styles.assignMsg} ${styles[assignMessage.type]}`}>
                {assignMessage.text}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlotFormModal;