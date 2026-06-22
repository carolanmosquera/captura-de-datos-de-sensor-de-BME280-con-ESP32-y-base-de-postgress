package com.example.sensores.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, max = 512, message = "La contraseña debe tener entre 6 y 512 caracteres")
    private String passwordHash;

    @Size(max = 20)
    private String phone;

    @NotBlank(message = "El estado es obligatorio")
    @Size(max = 20)
    private String status;

    @NotNull(message = "El rol es obligatorio")
    private Long roleId;
}