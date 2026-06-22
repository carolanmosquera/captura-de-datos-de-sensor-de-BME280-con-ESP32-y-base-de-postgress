package com.example.sensores.dto;

import lombok.Data;

@Data
public class PropertyResponseDTO {

    private Long id;
    private String name;

    private Long ownerId;
    private String ownerName;

    private Long propertyTypeId;
    private String propertyTypeName;

    private Double areaHectares;

    private Long locationId;

    private Integer slaveId;
    private String slaveStatus;
}