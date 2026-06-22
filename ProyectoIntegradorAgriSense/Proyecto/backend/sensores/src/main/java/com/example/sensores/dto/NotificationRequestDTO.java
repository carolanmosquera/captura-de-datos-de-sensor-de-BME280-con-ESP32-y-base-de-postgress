package com.example.sensores.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NotificationRequestDTO {

    @NotBlank(message = "El mensaje es obligatorio")
    @Size(max = 255)
    private String message;

    @NotBlank(message = "El estado de lectura es obligatorio")
    @Size(max = 10)
    private String readStatus;

    @NotNull(message = "El usuario es obligatorio")
    private Long userId;

    @NotNull(message = "La alerta es obligatoria")
    private Long alertId;
}