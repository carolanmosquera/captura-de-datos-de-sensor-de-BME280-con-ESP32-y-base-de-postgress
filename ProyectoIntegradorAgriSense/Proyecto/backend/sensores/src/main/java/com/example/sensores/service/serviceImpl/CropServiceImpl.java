package com.example.sensores.service.serviceImpl;

import com.example.sensores.dto.CropRequestDTO;
import com.example.sensores.dto.CropResponseDTO;
import com.example.sensores.model.Crop;
import com.example.sensores.model.Location;
import com.example.sensores.model.Plot;
import com.example.sensores.model.Property;
import com.example.sensores.repository.CropRepository;
import com.example.sensores.repository.LocationRepository;
import com.example.sensores.repository.PlotRepository;
import com.example.sensores.repository.PropertyRepository;
import com.example.sensores.service.CropService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CropServiceImpl implements CropService {

    private final CropRepository cropRepository;
    private final PlotRepository plotRepository;
    private final LocationRepository locationRepository;
    private final PropertyRepository propertyRepository;

    @Override
    public List<CropResponseDTO> getAllCrops() {
        return cropRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CropResponseDTO getCropById(Long id) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cultivo no encontrado con ID: " + id));
        return toResponseDTO(crop);
    }

    @Override
    @Transactional
    public CropResponseDTO createCrop(CropRequestDTO dto) {
        Crop crop = new Crop();

        crop.setName(dto.getName());
        crop.setScientificName(dto.getScientificName());
        crop.setDescription(dto.getDescription());
        crop.setIsCentralNode(dto.getIsCentralNode() != null ? dto.getIsCentralNode() : false);

        // Asignar Location si se proporciona
        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new EntityNotFoundException("Location no encontrada con ID: " + dto.getLocationId()));
            crop.setLocation(location);
        }

        // Asignar Property si se proporciona
        if (dto.getPropertyId() != null) {
            Property property = propertyRepository.findById(dto.getPropertyId())
                    .orElseThrow(() -> new EntityNotFoundException("Propiedad no encontrada con ID: " + dto.getPropertyId()));
            crop.setProperty(property);
        }

        Crop saved = cropRepository.save(crop);
        return toResponseDTO(saved);
    }

    @Override
    @Transactional
    public CropResponseDTO updateCrop(Long id, CropRequestDTO dto) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cultivo no encontrado con ID: " + id));

        crop.setName(dto.getName());
        crop.setScientificName(dto.getScientificName());
        crop.setDescription(dto.getDescription());
        crop.setIsCentralNode(dto.getIsCentralNode() != null ? dto.getIsCentralNode() : crop.getIsCentralNode());

        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new EntityNotFoundException("Location no encontrada con ID: " + dto.getLocationId()));
            crop.setLocation(location);
        } else {
            crop.setLocation(null);
        }

        if (dto.getPropertyId() != null) {
            Property property = propertyRepository.findById(dto.getPropertyId())
                    .orElseThrow(() -> new EntityNotFoundException("Propiedad no encontrada con ID: " + dto.getPropertyId()));
            crop.setProperty(property);
        } else {
            crop.setProperty(null);
        }

        return toResponseDTO(cropRepository.save(crop));
    }

    @Override
    public void deleteCrop(Long id) {
        if (!cropRepository.existsById(id)) {
            throw new EntityNotFoundException("Cultivo no encontrado con ID: " + id);
        }
        cropRepository.deleteById(id);
    }

   
    @Override
    public List<CropResponseDTO> getCropsByProperty(Long propertyId) {
        return cropRepository.findByPropertyId(propertyId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

     private CropResponseDTO toResponseDTO(Crop crop) {
        CropResponseDTO dto = new CropResponseDTO();
        dto.setId(crop.getId());
        dto.setName(crop.getName());
        dto.setScientificName(crop.getScientificName());
        dto.setDescription(crop.getDescription());
        dto.setIsCentralNode(crop.getIsCentralNode());

        if (crop.getLocation() != null) {
            dto.setLocationId(crop.getLocation().getId());
        }

        if (crop.getProperty() != null) {
            dto.setPropertyId(crop.getProperty().getId());
            dto.setPropertyName(crop.getProperty().getName());
        }

        return dto;
    }
}