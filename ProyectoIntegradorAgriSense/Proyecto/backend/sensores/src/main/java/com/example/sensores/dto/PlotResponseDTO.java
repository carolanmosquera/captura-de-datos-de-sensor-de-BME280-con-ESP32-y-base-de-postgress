package com.example.sensores.dto;

import lombok.Data;

@Data
public class PlotResponseDTO {

    private Long id;
    private String name;
    private Double area;
    private Long propertyId;
    private String propertyName;
    private Long cropId;
    private String cropName;
    private Boolean HasMaster;
}