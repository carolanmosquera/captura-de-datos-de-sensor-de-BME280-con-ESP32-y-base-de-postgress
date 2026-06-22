package com.example.sensores.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CropRequestDTO {

    @NotBlank(message = "El nombre del cultivo es obligatorio")
    @Size(max = 100)
    private String name;

    @Size(max = 150)
    private String scientificName;

    @Size(max = 255)
    private String description;

    private Boolean isCentralNode;
    private Long locationId;
    private Long propertyId; 
}