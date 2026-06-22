import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cropService } from '../../services/cropService';
import { plotService } from '../../services/plotService';
import styles from './CropDetailsModal.module.css';

export function CropDetailsModal({ isOpen, onClose, crop }) {
  const navigate = useNavigate();
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sub-formulario inline para asociar un lote
  const [isLinking, setIsLinking] = useState(false);
  const [availablePlots, setAvailablePlots] = useState([]);
  const [targetPlotId, setTargetPlotId] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkMessage, setLinkMessage] = useState(null);

  const fetchPlots = useCallback(async () => {
    if (!crop?.id) return;
    setLoading(true);
    try {
      const serverPlots = await cropService.getPlots(crop.id);
      setPlots(serverPlots || []);
    } catch (err) {
      console.error('Error al obtener lotes del cultivo:', err);
      setPlots([]);
    } finally {
      setLoading(false);
    }
  }, [crop]);

  useEffect(() => {
    if (isOpen) {
      fetchPlots();
      setIsLinking(false);
      setTargetPlotId('');
      setLinkMessage(null);
    }
  }, [isOpen, fetchPlots]);

  const handleOpenLinkSection = async () => {
    setIsLinking(true);
    setLinkMessage(null);
    try {
      const allPlots = await plotService.getAll();
      // Filtramos los que ya están vinculados a este cultivo
      const unlinked = allPlots.filter(p => p.cropId !== crop.id);
      setAvailablePlots(unlinked);
    } catch (err) {
      console.error('Error obteniendo lotes disponibles:', err);
      setAvailablePlots([]);
    }
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!targetPlotId) return;
    setLinkLoading(true);
    setLinkMessage(null);
    try {
      const plot = await plotService.getById(parseInt(targetPlotId));
      const updatedPlot = {
        ...plot,
        cropId: crop.id,
        propertyId: plot.propertyId,
        name: plot.name,
        area: plot.area,
        hasMaster: plot.hasMaster,
      };
      await plotService.update(parseInt(targetPlotId), updatedPlot);
      setLinkMessage({ type: 'success', text: 'Lote vinculado correctamente.' });
      setIsLinking(false);
      setTargetPlotId('');
      fetchPlots();
    } catch (err) {
      setLinkMessage({ type: 'error', text: 'No se pudo asociar el lote. Intenta de nuevo.' });
    } finally {
      setLinkLoading(false);
    }
  };

  const handleGoToPlot = (plotId) => {
    onClose();
    navigate(`/plots/${plotId}`);
  };

  if (!isOpen || !crop) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.headerIcon}>🌾</span>
            <div>
              <h2 className={styles.headerTitle}>{crop.name}</h2>
              {crop.scientificName && (
                <p className={styles.headerSci}><em>{crop.scientificName}</em></p>
              )}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </header>

        {/* Meta-información */}
        <div className={styles.body}>
          {crop.description && (
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>Descripción</span>
              <p className={styles.infoText}>{crop.description}</p>
            </div>
          )}

          <div className={styles.metaRow}>
            {crop.locationId && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Ubicación (ID)</span>
                <span className={styles.metaValue}>{crop.locationId}</span>
              </div>
            )}
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Nodo Central</span>
              <span className={`${styles.metaValue} ${crop.isCentralNode ? styles.badgeYes : styles.badgeNo}`}>
                {crop.isCentralNode ? '📡 Sí' : 'No'}
              </span>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Sección de lotes */}
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Lotes que siembran este cultivo</h3>
            {!isLinking && (
              <button className={styles.linkBtn} onClick={handleOpenLinkSection}>
                + Asociar Lote
              </button>
            )}
          </div>

          {/* Mensaje de resultado de vinculación */}
          {linkMessage && (
            <div className={`${styles.linkMessage} ${styles[linkMessage.type]}`}>
              {linkMessage.text}
            </div>
          )}

          {/* Formulario inline de asociación */}
          {isLinking && (
            <form onSubmit={handleLinkSubmit} className={styles.inlineForm}>
              <select
                value={targetPlotId}
                onChange={e => setTargetPlotId(e.target.value)}
                className={styles.inlineSelect}
                required
              >
                <option value="">— Seleccione un lote disponible —</option>
                {availablePlots.length === 0 && (
                  <option disabled>No hay lotes disponibles</option>
                )}
                {availablePlots.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.area ? `(${p.area} m²)` : ''}
                  </option>
                ))}
              </select>
              <div className={styles.inlineActions}>
                <button
                  type="submit"
                  className={styles.inlineSaveBtn}
                  disabled={linkLoading || !targetPlotId}
                >
                  {linkLoading ? 'Guardando...' : 'Asignar'}
                </button>
                <button
                  type="button"
                  className={styles.inlineCancelBtn}
                  onClick={() => { setIsLinking(false); setTargetPlotId(''); }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Lista de lotes vinculados */}
          {loading ? (
            <p className={styles.stateText}>Consultando lotes...</p>
          ) : plots.length === 0 ? (
            <div className={styles.emptyPlots}>
              <span>📦</span>
              <p>No hay lotes asociados a este cultivo.</p>
            </div>
          ) : (
            <div className={styles.plotList}>
              {plots.map(plot => (
                <div
                  key={plot.id}
                  className={styles.plotCard}
                  onClick={() => handleGoToPlot(plot.id)}
                  title="Ver detalle del lote"
                >
                  <div className={styles.plotCardLeft}>
                    <span className={styles.plotIcon}>📦</span>
                    <div>
                      <div className={styles.plotName}>{plot.name}</div>
                      <div className={styles.plotMeta}>
                        {plot.area ? `${plot.area} m²` : ''}
                        {plot.area && plot.areaHectares ? ' · ' : ''}
                        {plot.areaHectares ? `${plot.areaHectares} ha` : ''}
                      </div>
                    </div>
                  </div>
                  <span className={styles.plotArrow}>Monitorear →</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CropDetailsModal;
