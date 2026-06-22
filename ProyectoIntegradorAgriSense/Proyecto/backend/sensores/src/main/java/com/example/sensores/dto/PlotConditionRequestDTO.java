package com.example.sensores.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PlotConditionRequestDTO {

    @NotNull(message = "El cultivo es obligatorio")
    private Long PlotId;

    @NotNull(message = "La temperatura mínima es obligatoria")
    private Double minTemperature;

    @NotNull(message = "La temperatura máxima es obligatoria")
    private Double maxTemperature;

    @NotNull(message = "La humedad mínima es obligatoria")
    private Double minHumidity;

    @NotNull(message = "La humedad máxima es obligatoria")
    private Double maxHumidity;

    @NotNull(message = "La etapa fenológica es obligatoria")
    private Long stageId;
}