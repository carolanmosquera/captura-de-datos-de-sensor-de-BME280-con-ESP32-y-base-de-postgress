package com.example.sensores.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PlotRequestDTO {

    @NotBlank(message = "El nombre del lote es obligatorio")
    @Size(max = 100)
    private String name;

    @NotNull(message = "El área es obligatoria")
    private Double area;

    @NotNull(message = "La propiedad es obligatoria")
    private Long propertyId;

    @NotNull(message = "El cultivo es obligatorio")
    private Long cropId;

    private Boolean HasMaster;
}