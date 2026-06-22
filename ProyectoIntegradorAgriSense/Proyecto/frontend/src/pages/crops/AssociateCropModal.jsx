import { useState, useEffect } from 'react';
import { propertyService } from '../../services/propertyService';
import { plotService } from '../../services/plotService';
import { cropService } from '../../services/cropService';
import styles from './AssociateCropModal.module.css';

export function AssociateCropModal({ isOpen, onClose, crop, onSyncSuccess }) {
  const [associationType, setAssociationType] = useState('property');
  const [properties, setProperties] = useState([]);
  const [plots, setPlots] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedId('');
      setMessage(null);
      const loadOptions = async () => {
        try {
          const [propsData, plotsData] = await Promise.all([
            propertyService.getAll(),
            plotService.getAll(),
          ]);
          setProperties(propsData || []);
          setPlots(plotsData || []);
        } catch (err) {
          console.error('Error cargando catálogos:', err);
        }
      };
      loadOptions();
    }
  }, [isOpen]);

  if (!isOpen || !crop) return null;

  const handleTypeChange = (type) => {
    setAssociationType(type);
    setSelectedId('');
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) return;
    setSubmitting(true);
    setMessage(null);

    try {
      if (associationType === 'property') {
        const currentCrop = await cropService.getById(crop.id);
        await cropService.update(crop.id, {
          ...currentCrop,
          propertyId: parseInt(selectedId)
                });
      } else {
        // Actualizar el Lote asignándole este cropId
        const plot = await plotService.getById(parseInt(selectedId));
        await plotService.update(parseInt(selectedId), {
          ...plot,
          cropId: crop.id,
        });
      }
      setMessage({ type: 'success', text: 'Asociación guardada correctamente.' });
      if (onSyncSuccess) onSyncSuccess();
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error al procesar la asociación. Intenta de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  };

  const currentList = associationType === 'property' ? properties : plots;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <header className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.headerIcon}>🔗</span>
            <div>
              <h2 className={styles.headerTitle}>Asociar Cultivo</h2>
              <p className={styles.headerSub}>{crop.name}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Tipo de asociación */}
          <div className={styles.field}>
            <label className={styles.label}>Asociar a</label>
            <div className={styles.radioGroup}>
              <label
                className={`${styles.radioCard} ${associationType === 'property' ? styles.radioActive : ''}`}
              >
                <input
                  type="radio"
                  value="property"
                  checked={associationType === 'property'}
                  onChange={() => handleTypeChange('property')}
                  className={styles.radioInput}
                />
                <span className={styles.radioIcon}>🏡</span>
                <div>
                  <div className={styles.radioLabel}>Propiedad</div>
                  <div className={styles.radioHint}>Finca o terreno registrado</div>
                </div>
              </label>

              <label
                className={`${styles.radioCard} ${associationType === 'plot' ? styles.radioActive : ''}`}
              >
                <input
                  type="radio"
                  value="plot"
                  checked={associationType === 'plot'}
                  onChange={() => handleTypeChange('plot')}
                  className={styles.radioInput}
                />
                <span className={styles.radioIcon}>📦</span>
                <div>
                  <div className={styles.radioLabel}>Lote (Plot)</div>
                  <div className={styles.radioHint}>Sector específico del terreno</div>
                </div>
              </label>
            </div>
          </div>

          {/* Selector de destino */}
          <div className={styles.field}>
            <label htmlFor="targetSelect" className={styles.label}>
              Seleccionar {associationType === 'property' ? 'Propiedad' : 'Lote'} *
            </label>
            <select
              id="targetSelect"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className={styles.select}
              required
            >
              <option value="">— Seleccione una opción —</option>
              {currentList.length === 0 && (
                <option disabled>No hay opciones disponibles</option>
              )}
              {currentList.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                  {associationType === 'plot' && item.area ? ` (${item.area} m²)` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Mensaje de resultado */}
          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <footer className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting || !selectedId}
            >
              {submitting ? 'Guardando...' : 'Confirmar Asociación'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default AssociateCropModal;
