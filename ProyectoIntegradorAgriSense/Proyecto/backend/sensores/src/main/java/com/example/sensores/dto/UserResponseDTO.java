package com.example.sensores.dto;

import lombok.Data;

@Data
public class UserResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String status;
    private Long roleId;
    private String roleName;
}