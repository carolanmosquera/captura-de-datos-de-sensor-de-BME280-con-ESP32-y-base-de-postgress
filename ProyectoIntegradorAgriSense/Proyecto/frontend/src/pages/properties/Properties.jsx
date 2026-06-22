import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import PropertyFormModal from '../../components/properties/PropertyFormModal';
import { CropDetailsModal } from '../crops/CropDetailsModal';
import { propertyService } from '../../services/propertyService';
import { cropService } from '../../services/cropService';
import { useAuth } from '../../context/AuthContext';
import styles from './Properties.module.css';

export function Properties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modales de Propiedad
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  // Estados para Flujo de Cultivos Relacionados
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [relatedCrops, setRelatedCrops] = useState([]);
  const [cropsLoading, setCropsLoading] = useState(false);

  // Modal de detalles del cultivo seleccionado
  const [detailsCrop, setDetailsCrop] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchProperties = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      let data;
      try {
        data = await propertyService.getPropertiesByOwner(user.id);
      } catch (err) {
        console.warn('Fallback to getAllProperties');
        data = await propertyService.getAll();
      }
      setProperties(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('No se pudieron cargar las propiedades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const handlePropertySelect = async (property) => {
    // Si ya está seleccionada la misma, deseleccionar
    if (selectedProperty?.id === property.id) {
      setSelectedProperty(null);
      setRelatedCrops([]);
      return;
    }
    setSelectedProperty(property);
    setCropsLoading(true);
    try {
      const data = await cropService.getByProperty(property.id);
      setRelatedCrops(data || []);
    } catch (err) {
      console.error('Error cargando cultivos:', err);
      setRelatedCrops([]);
    } finally {
      setCropsLoading(false);
    }
  };

  const handleOpenCropDetails = (crop, e) => {
    e.stopPropagation();
    setDetailsCrop(crop);
    setDetailsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingProperty(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (property, e) => {
    e.stopPropagation();
    setEditingProperty(property);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      const payload = { ...formData, ownerId: user?.id };
      if (editingProperty) {
        const updated = await propertyService.update(editingProperty.id, payload);
        setProperties(prev => prev.map(p => p.id === editingProperty.id ? updated : p));
      } else {
        const created = await propertyService.create(payload);
        setProperties(prev => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving property:', err);
      alert('Error al guardar la propiedad.');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) return;
    try {
      await propertyService.remove(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      if (selectedProperty?.id === id) {
        setSelectedProperty(null);
        setRelatedCrops([]);
      }
    } catch (err) {
      alert('Error al eliminar la propiedad');
    }
  };

  const getPropertyTypeName = (typeId) => {
    const types = { 1: 'Rural / Agrícola', 2: 'Ganadera', 3: 'Mixta' };
    return types[typeId] || 'Desconocido';
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Gestión de Propiedades</h1>
            <p className={styles.subtitle}>Selecciona una propiedad para ver sus cultivos relacionados</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.secondaryBtn} onClick={() => navigate('/plots')}>
              Ver Lotes
            </button>
            <button className={styles.addBtn} onClick={handleOpenCreate}>
              <span>+</span> Registrar Propiedad
            </button>
          </div>
        </header>

        {loading ? (
          <div className={styles.loading}>Cargando propiedades...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : properties.length === 0 ? (
          <div className={styles.empty}>No hay propiedades registradas</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre <span className={styles.hint}>(clic para ver cultivos)</span></th>
                  <th>Área (ha)</th>
                  <th>Tipo</th>
                  <th>Ubicación (ID)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr
                    key={property.id}
                    onClick={() => handlePropertySelect(property)}
                    className={`${styles.rowSelectable} ${selectedProperty?.id === property.id ? styles.rowActive : ''}`}
                  >
                    <td>
                      <div className={styles.propertyNameCell}>
                        <span className={styles.propertyIcon}>🏡</span>
                        <strong>{property.name}</strong>
                        {selectedProperty?.id === property.id && (
                          <span className={styles.expandedBadge}>Expandido</span>
                        )}
                      </div>
                    </td>
                    <td>{property.areaHectares}</td>
                    <td>
                      <span className={styles.typeBadge}>{getPropertyTypeName(property.propertyTypeId)}</span>
                    </td>
                    <td>{property.locationId || '-'}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                          onClick={(e) => handleOpenEdit(property, e)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={(e) => handleDelete(property.id, e)}
                          title="Eliminar"
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

        {/* Panel de cultivos relacionados */}
        {selectedProperty && (
          <div className={styles.relatedSection}>
            <div className={styles.relatedHeader}>
              <div className={styles.relatedTitleGroup}>
                <span className={styles.relatedIcon}>🌿</span>
                <div>
                  <h3 className={styles.relatedTitle}>Cultivos en: {selectedProperty.name}</h3>
                  <p className={styles.relatedSubtitle}>Haz clic en un cultivo para ver sus detalles y lotes asociados</p>
                </div>
              </div>
              <button className={styles.closeRelatedBtn} onClick={() => { setSelectedProperty(null); setRelatedCrops([]); }}>
                ✕
              </button>
            </div>

            {cropsLoading ? (
              <div className={styles.cropsLoading}>Cargando cultivos...</div>
            ) : relatedCrops.length === 0 ? (
              <div className={styles.noCrops}>
                <span>🌱</span>
                <p>No hay cultivos asociados a esta propiedad.</p>
              </div>
            ) : (
              <div className={styles.cropsGrid}>
                {relatedCrops.map(crop => (
                  <div
                    key={crop.id}
                    className={styles.cropCard}
                    onClick={(e) => handleOpenCropDetails(crop, e)}
                  >
                    <div className={styles.cropCardIcon}>🌾</div>
                    <div className={styles.cropCardBody}>
                      <div className={styles.cropCardName}>{crop.name}</div>
                      {crop.scientificName && (
                        <div className={styles.cropCardSci}><em>{crop.scientificName}</em></div>
                      )}
                      {crop.description && (
                        <div className={styles.cropCardDesc}>{crop.description}</div>
                      )}
                    </div>
                    <div className={styles.cropCardAction}>
                      Ver detalles →
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <PropertyFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingProperty}
        />

        {/* Modal de detalles del cultivo con sus lotes */}
        <CropDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => { setDetailsModalOpen(false); setDetailsCrop(null); }}
          crop={detailsCrop}
        />
      </div>
    </AppLayout>
  );
}

export default Properties;
