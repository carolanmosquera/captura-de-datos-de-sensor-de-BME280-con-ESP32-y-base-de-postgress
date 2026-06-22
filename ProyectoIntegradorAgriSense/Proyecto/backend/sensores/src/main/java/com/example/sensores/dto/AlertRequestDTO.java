package com.example.sensores.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AlertRequestDTO {

    @NotBlank(message = "El tipo de alerta es obligatorio")
    @Size(max = 50)
    private String type;

    @NotBlank(message = "El nivel de severidad es obligatorio")
    @Size(max = 10)
    private String severity;

    @NotBlank(message = "El mensaje de alerta es obligatorio")
    @Size(max = 255)
    private String message;

    @NotBlank(message = "El generador de la alerta es obligatorio")
    @Size(max = 10)
    private String generatedBy;

    // Nullable: la alerta puede generarse sin dato de medición asociado
    private Integer dataId;

    @NotNull(message = "La condición de cultivo es obligatoria")
    private Long PlotConditionId;

    @NotNull(message = "El nodo esclavo es obligatorio")
    private Integer slaveId;
}