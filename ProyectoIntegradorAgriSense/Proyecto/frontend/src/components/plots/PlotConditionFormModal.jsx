import { useState, useEffect } from 'react';
import { plotConditionService } from '../../services/plotConditionService';
import { phenologicalStageService } from '../../services/phenologicalStageService';
import styles from './PlotConditionFormModal.module.css';

export function PlotConditionFormModal({ isOpen, onClose, plotId, initialData, onSuccess }) {
  const [formData, setFormData] = useState({
    minTemperature: '',
    maxTemperature: '',
    minHumidity: '',
    maxHumidity: '',
    stageId: '',
  });
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Cargar etapas disponibles al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const fetchStages = async () => {
        setLoading(true);
        try {
          const data = await phenologicalStageService.getAll();
          setStages(data || []);
        } catch (err) {
          console.error('Error cargando etapas fenológicas:', err);
          setError('No se pudieron cargar las etapas fenológicas.');
        } finally {
          setLoading(false);
        }
      };
      fetchStages();

      // Si estamos editando, llenar el formulario con los datos existentes
      if (initialData) {
        setFormData({
          minTemperature: initialData.minTemperature ?? '',
          maxTemperature: initialData.maxTemperature ?? '',
          minHumidity: initialData.minHumidity ?? '',
          maxHumidity: initialData.maxHumidity ?? '',
          stageId: initialData.stageId ?? '',
        });
      } else {
        setFormData({
          minTemperature: '',
          maxTemperature: '',
          minHumidity: '',
          maxHumidity: '',
          stageId: '',
        });
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.minTemperature || !formData.maxTemperature || !formData.minHumidity || !formData.maxHumidity || !formData.stageId) {
      setError('Todos los campos son obligatorios.');
      return false;
    }
    const minTemp = parseFloat(formData.minTemperature);
    const maxTemp = parseFloat(formData.maxTemperature);
    const minHum = parseFloat(formData.minHumidity);
    const maxHum = parseFloat(formData.maxHumidity);
    if (minTemp >= maxTemp) {
      setError('La temperatura mínima debe ser menor que la máxima.');
      return false;
    }
    if (minHum >= maxHum) {
      setError('La humedad mínima debe ser menor que la máxima.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        plotId: plotId,
        minTemperature: parseFloat(formData.minTemperature),
        maxTemperature: parseFloat(formData.maxTemperature),
        minHumidity: parseFloat(formData.minHumidity),
        maxHumidity: parseFloat(formData.maxHumidity),
        stageId: parseInt(formData.stageId),
      };
      if (initialData) {
        await plotConditionService.update(initialData.id, payload);
      } else {
        await plotConditionService.create(payload);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Error al guardar la condición. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>{initialData ? 'Editar Condición del Lote' : 'Nueva Condición del Lote'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="minTemperature">Temperatura mínima (°C) *</label>
            <input
              type="number"
              step="0.1"
              id="minTemperature"
              name="minTemperature"
              value={formData.minTemperature}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="maxTemperature">Temperatura máxima (°C) *</label>
            <input
              type="number"
              step="0.1"
              id="maxTemperature"
              name="maxTemperature"
              value={formData.maxTemperature}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="minHumidity">Humedad mínima (%) *</label>
            <input
              type="number"
              step="0.1"
              id="minHumidity"
              name="minHumidity"
              value={formData.minHumidity}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="maxHumidity">Humedad máxima (%) *</label>
            <input
              type="number"
              step="0.1"
              id="maxHumidity"
              name="maxHumidity"
              value={formData.maxHumidity}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="stageId">Etapa fenológica *</label>
            <select
              id="stageId"
              name="stageId"
              value={formData.stageId}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">-- Seleccione una etapa --</option>
              {stages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>
            {loading && <span className={styles.hint}>Cargando etapas...</span>}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <footer className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear')}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}