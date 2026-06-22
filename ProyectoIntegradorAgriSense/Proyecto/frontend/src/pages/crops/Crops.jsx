import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import CropFormModal from '../../components/crops/CropFormModal';
import { CropDetailsModal } from './CropDetailsModal';
import { AssociateCropModal } from './AssociateCropModal';
import { cropService } from '../../services/cropService';
import styles from './Crops.module.css';

export function Crops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal CRUD
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);

  // Modal Detalles (lotes vinculados)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Modal Asociar (a propiedad o lote)
  const [associateModalOpen, setAssociateModalOpen] = useState(false);
  const [associateCrop, setAssociateCrop] = useState(null);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const data = await cropService.getAll();
      setCrops(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching crops:', err);
      setError('No se pudieron cargar los cultivos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleOpenCreate = () => {
    setEditingCrop(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (crop) => {
    setEditingCrop(crop);
    setModalOpen(true);
  };

  const handleOpenDetails = (crop) => {
    setSelectedCrop(crop);
    setDetailsModalOpen(true);
  };

  const handleOpenAssociate = (crop) => {
    setAssociateCrop(crop);
    setAssociateModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCrop) {
        const updated = await cropService.update(editingCrop.id, formData);
        setCrops(prev => prev.map(c => c.id === editingCrop.id ? updated : c));
      } else {
        const created = await cropService.create(formData);
        setCrops(prev => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      alert('Error al guardar el cultivo');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este cultivo?')) return;
    try {
      await cropService.remove(id);
      setCrops(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Error al eliminar el cultivo');
    }
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gestión de Cultivos</h1>
          <button className={styles.addBtn} onClick={handleOpenCreate}>
            <span>+</span> Nuevo Cultivo
          </button>
        </header>

        {loading ? (
          <div className={styles.loading}>Cargando cultivos...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : crops.length === 0 ? (
          <div className={styles.empty}>No hay cultivos registrados</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Nombre Científico</th>
                  <th>Ubicación (ID)</th>
                  <th>Nodo Central</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {crops.map(crop => (
                  <tr key={crop.id}>
                    <td className={styles.idCell}>{crop.id}</td>
                    <td>
                      <span className={styles.cropName}>{crop.name}</span>
                    </td>
                    <td className={styles.sciName}>{crop.scientificName || '—'}</td>
                    <td>{crop.locationId || '—'}</td>
                    <td>
                      {crop.isCentralNode ? (
                        <span className={styles.centralBadge}>📡 Sí</span>
                      ) : (
                        <span className={styles.noBadge}>No</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={`${styles.actionBtn} ${styles.detailsBtn}`}
                          onClick={() => handleOpenDetails(crop)}
                          title="Ver lotes vinculados"
                        >
                          📋 Ver Detalles
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.linkBtn}`}
                          onClick={() => handleOpenAssociate(crop)}
                          title="Asociar a propiedad o lote"
                        >
                          🔗 Asociar
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                          onClick={() => handleOpenEdit(crop)}
                          title="Editar cultivo"
                        >
                          ✏️
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDelete(crop.id)}
                          title="Eliminar cultivo"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal CRUD */}
        <CropFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingCrop}
        />

        {/* Modal Detalles — lotes vinculados al cultivo */}
        <CropDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => { setDetailsModalOpen(false); setSelectedCrop(null); }}
          crop={selectedCrop}
        />

        {/* Modal Asociar — a propiedad o lote */}
        <AssociateCropModal
          isOpen={associateModalOpen}
          onClose={() => { setAssociateModalOpen(false); setAssociateCrop(null); }}
          crop={associateCrop}
          onSyncSuccess={fetchCrops}
        />
      </div>
    </AppLayout>
  );
}

export default Crops;
