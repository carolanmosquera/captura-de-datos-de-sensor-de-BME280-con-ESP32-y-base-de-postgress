package com.example.sensores.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PropertyRequestDTO {

    @NotBlank(message = "El nombre de la propiedad es obligatorio")
    @Size(max = 100)
    private String name;

    @NotNull(message = "El propietario es obligatorio")
    private Long ownerId;

    @NotNull(message = "El tipo de propiedad es obligatorio")
    private Long propertyTypeId;

    @NotNull(message = "El área en hectáreas es obligatoria")
    @Positive(message = "El área debe ser mayor a cero")
    private Double areaHectares;

    @NotNull(message = "La ubicación es obligatoria")
    private Long locationId;

    private Integer slaveId;
}