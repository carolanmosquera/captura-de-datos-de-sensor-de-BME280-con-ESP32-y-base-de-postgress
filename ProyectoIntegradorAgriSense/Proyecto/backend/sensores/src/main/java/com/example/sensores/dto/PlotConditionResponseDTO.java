package com.example.sensores.dto;

import lombok.Data;

@Data
public class PlotConditionResponseDTO {

    private Long id;
    private Long PlotId;
    private String PlotName;
    private Double minTemperature;
    private Double maxTemperature;
    private Double minHumidity;
    private Double maxHumidity;
    private Long stageId;
    private String stageName;
}