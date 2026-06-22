package com.example.sensores.service.serviceImpl;

import com.example.sensores.dto.PropertyRequestDTO;
import com.example.sensores.dto.PropertyResponseDTO;
import com.example.sensores.model.Location;
import com.example.sensores.model.Property;
import com.example.sensores.model.PropertyType;
import com.example.sensores.model.User;
import com.example.sensores.repository.LocationRepository;
import com.example.sensores.repository.PropertyRepository;
import com.example.sensores.repository.PropertyTypeRepository;
import com.example.sensores.repository.UserRepository;
import com.example.sensores.service.PropertyService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertyTypeRepository propertyTypeRepository;
    private final LocationRepository locationRepository;
    // private final Esp32SlaveRepository esp32SlaveRepository; ← eliminado

    @Override
    public List<PropertyResponseDTO> getAllProperties() {
        return propertyRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public PropertyResponseDTO getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Propiedad no encontrada con ID: " + id));
        return toResponseDTO(property);
    }

    @Override
    public List<PropertyResponseDTO> getPropertiesByOwner(Long ownerId) {
        return propertyRepository.findByOwner_Id(ownerId)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public PropertyResponseDTO createProperty(PropertyRequestDTO dto) {
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + dto.getOwnerId()));
        PropertyType propertyType = propertyTypeRepository.findById(dto.getPropertyTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de propiedad no encontrado con ID: " + dto.getPropertyTypeId()));
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new EntityNotFoundException("Ubicación no encontrada con ID: " + dto.getLocationId()));

        Property property = new Property();
        property.setName(dto.getName());
        property.setOwner(owner);
        property.setPropertyType(propertyType);
        property.setAreaHectares(dto.getAreaHectares());
        property.setLocation(location);
        // property.setSlave(...) ← eliminado

        return toResponseDTO(propertyRepository.save(property));
    }

    @Override
    public PropertyResponseDTO updateProperty(Long id, PropertyRequestDTO dto) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Propiedad no encontrada con ID: " + id));

        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + dto.getOwnerId()));
        PropertyType propertyType = propertyTypeRepository.findById(dto.getPropertyTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de propiedad no encontrado con ID: " + dto.getPropertyTypeId()));
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new EntityNotFoundException("Ubicación no encontrada con ID: " + dto.getLocationId()));

        property.setName(dto.getName());
        property.setOwner(owner);
        property.setPropertyType(propertyType);
        property.setAreaHectares(dto.getAreaHectares());
        property.setLocation(location);
        // property.setSlave(...) ← eliminado

        return toResponseDTO(propertyRepository.save(property));
    }

    @Override
    public void deleteProperty(Long id) {
        if (!propertyRepository.existsById(id)) throw new EntityNotFoundException("Propiedad no encontrada con ID: " + id);
        propertyRepository.deleteById(id);
    }

    private PropertyResponseDTO toResponseDTO(Property property) {
        PropertyResponseDTO dto = new PropertyResponseDTO();
        dto.setId(property.getId());
        dto.setName(property.getName());
        dto.setAreaHectares(property.getAreaHectares());
        if (property.getOwner() != null) {
            dto.setOwnerId(property.getOwner().getId());
            dto.setOwnerName(property.getOwner().getName());
        }
        if (property.getPropertyType() != null) {
            dto.setPropertyTypeId(property.getPropertyType().getId());
            dto.setPropertyTypeName(property.getPropertyType().getName());
        }
        if (property.getLocation() != null) {
            dto.setLocationId(property.getLocation().getId());
        }
        // Campo slave eliminado
        return dto;
    }
}