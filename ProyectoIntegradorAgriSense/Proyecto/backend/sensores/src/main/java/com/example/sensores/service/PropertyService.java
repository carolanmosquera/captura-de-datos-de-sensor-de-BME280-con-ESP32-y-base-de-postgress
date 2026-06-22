package com.example.sensores.service;

import com.example.sensores.dto.PropertyRequestDTO;
import com.example.sensores.dto.PropertyResponseDTO;
import java.util.List;

public interface PropertyService {

    List<PropertyResponseDTO> getAllProperties();
    PropertyResponseDTO getPropertyById(Long id);
    List<PropertyResponseDTO> getPropertiesByOwner(Long ownerId);
    PropertyResponseDTO createProperty(PropertyRequestDTO dto);
    PropertyResponseDTO updateProperty(Long id, PropertyRequestDTO dto);
    void deleteProperty(Long id);
}