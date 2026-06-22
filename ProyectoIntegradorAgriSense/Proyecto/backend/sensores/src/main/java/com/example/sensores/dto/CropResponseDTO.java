package com.example.sensores.dto;

import lombok.Data;

@Data
public class CropResponseDTO {

    private Long id;
    private String name;
    private String scientificName;
    private String description;
    private Boolean isCentralNode;
    private Long locationId;
    private Long propertyId;    // ← nuevo
    private String propertyName;
}