import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AppLayout from '../../components/layout/AppLayout';
import PlotFormModal from '../../components/plots/PlotFormModal';
import { plotService } from '../../services/plotService';
import { cropService } from '../../services/cropService';
import { propertyService } from '../../services/propertyService';
import { useAuth } from '../../context/AuthContext';
import styles from './Plots.module.css';

export function Plots() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plots, setPlots] = useState([]);
  const [crops, setCrops] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [plotsData, cropsData, propsData] = await Promise.all([
        plotService.getAll(),
        cropService.getAll(),
        propertyService.getAll(),
      ]);
      setPlots(plotsData || []);
      setCrops(cropsData || []);
      setProperties(propsData || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching plots:', err);
      setError('No se pudieron cargar los lotes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpenCreate = () => {
    setEditingPlot(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (plot) => {
    setEditingPlot(plot);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPlot) {
        const updated = await plotService.update(editingPlot.id, formData);
        setPlots(prev => prev.map(p => p.id === editingPlot.id ? updated : p));
      } else {
        const created = await plotService.create(formData);
        setPlots(prev => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      alert('Error al guardar el lote. Verifique los datos.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este lote?')) return;
    try {
      await plotService.remove(id);
      setPlots(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Error al eliminar el lote.');
    }
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Gestión de Lotes</h1>
            <p className={styles.subtitle}>Administra los sectores y asigna nodos sensores</p>
          </div>
          <button className={styles.addBtn} onClick={handleOpenCreate}>
            <span>+</span> Nuevo Lote
          </button>
        </header>

        {loading ? (
          <div className={styles.loading}>Cargando lotes...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : plots.length === 0 ? (
          <div className={styles.empty}>No hay lotes registrados</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Área (m²)</th>
                  <th>Propiedad</th>
                  <th>Cultivo</th>
                  <th>ESP-Master</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {plots.map(plot => (
                  <tr key={plot.id}>
                    <td><strong>{plot.name}</strong></td>
                    <td>{plot.area}</td>
                    <td>{plot.propertyName || plot.propertyId || '-'}</td>
                    <td>{plot.cropName || plot.cropId || '-'}</td>
                    <td>
                      {plot.hasMaster ? (
                        <span className={styles.masterBadge}>📡 Sí</span>
                      ) : (
                        <span className={styles.noMaster}>No</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                          onClick={() => handleOpenEdit(plot)}
                          title="Editar lote / Asignar sensor"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDelete(plot.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.detailBtn}`}
                          onClick={() => navigate(`/plots/${plot.id}`)}
                          title="Ver detalle del lote"
                        >
                          📊 Ver detalle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <PlotFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingPlot}
          crops={crops}
          properties={properties}
        />
      </div>
    </AppLayout>
  );
}

export default Plots;