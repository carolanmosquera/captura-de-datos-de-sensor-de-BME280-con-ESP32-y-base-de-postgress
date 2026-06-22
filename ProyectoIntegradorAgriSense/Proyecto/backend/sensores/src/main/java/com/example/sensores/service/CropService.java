package com.example.sensores.service;

import com.example.sensores.dto.CropRequestDTO;
import com.example.sensores.dto.CropResponseDTO;
import java.util.List;

public interface CropService {

    List<CropResponseDTO> getAllCrops();
    CropResponseDTO getCropById(Long id);
    CropResponseDTO createCrop(CropRequestDTO dto);
    CropResponseDTO updateCrop(Long id, CropRequestDTO dto);
    void deleteCrop(Long id);

    /**
     * Devuelve los cultivos únicos vinculados a una propiedad,
     * navegando a través de sus lotes: Property → Plot → Crop
     */
    List<CropResponseDTO> getCropsByProperty(Long propertyId);

}