import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { propertyService } from '../services/propertyService';

/**
 * Componente para el registro de nuevas propiedades y asignación de sensores.
 */
const PropertyForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [availableSlaves, setAvailableSlaves] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    areaHectares: '',
    propertyTypeId: 1, // Por defecto: Rural/Agrícola
    locationId: 1,     // Por defecto: Localización principal
    slaveId: ''
  });

  useEffect(() => {
    fetchAvailableSensors();
  }, []);

  const fetchAvailableSensors = async () => {
    try {
      const slaves = await propertyService.getAvailableSlaves();
      setAvailableSlaves(slaves);
    } catch (err) {
      console.error('Error al cargar sensores disponibles');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Mapeo exacto a PropertyRequestDTO
    const payload = {
      name: formData.name,
      ownerId: user?.id,
      propertyTypeId: parseInt(formData.propertyTypeId),
      areaHectares: parseFloat(formData.areaHectares),
      locationId: parseInt(formData.locationId),
      slaveId: formData.slaveId
    };

    try {
      await propertyService.createProperty(payload);
      setSuccess('Propiedad registrada y sensor vinculado correctamente.');
      setFormData({ name: '', areaHectares: '', propertyTypeId: 1, locationId: 1, slaveId: '' });
      
      if (onSuccess) onSuccess();
      
      // Actualizar lista de sensores (el que acabamos de usar ya no debería estar disponible)
      fetchAvailableSensors();
    } catch (err) {
      setError('Hubo un problema al guardar la propiedad. Verifique los campos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel" style={{ borderLeft: '4px solid #52e084' }}>
      <header className="panel-header">
        <h2>Registrar Propiedad</h2>
        <span>Configuración de Terreno</span>
      </header>
      
      <p style={{ marginBottom: '15px', color: '#94a3b8' }}>
        Complete los datos para dar de alta un nuevo predio y vincular un nodo ESP32.
      </p>

      {error && <div style={{ color: '#f87171', padding: '10px', background: '#450a0a', borderRadius: '5px', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: '#4ade80', padding: '10px', background: '#064e3b', borderRadius: '5px', marginBottom: '10px' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#52e084' }}>Nombre de la Propiedad *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Finca Valle Verde"
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#52e084' }}>Extensión (Hectáreas) *</label>
          <input
            type="number"
            step="0.01"
            name="areaHectares"
            value={formData.areaHectares}
            onChange={handleChange}
            placeholder="Ej: 10.5"
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#52e084' }}>Asignar Nodo Sensor (ESP32) *</label>
          <select
            name="slaveId"
            value={formData.slaveId}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #475569',
              background: '#172630',
              color: 'white',
              marginTop: '10px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">-- Seleccione un Sensor Disponible --</option>
            {availableSlaves.map(slave => (
              <option key={slave.id} value={slave.id}>
                {slave.deviceName || `Nodo ID: ${slave.id}`}
              </option>
            ))}
          </select>
          {availableSlaves.length === 0 && (
            <span style={{ fontSize: '11px', color: '#fca5a5', display: 'block', marginTop: '5px' }}>
              No hay sensores libres detectados en el sistema.
            </span>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            marginTop: '10px',
            background: loading ? '#334155' : '#2563eb',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {loading ? 'Guardando...' : 'Crear Propiedad'}
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;
