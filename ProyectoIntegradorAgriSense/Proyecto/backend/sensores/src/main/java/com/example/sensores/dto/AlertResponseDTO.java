package com.example.sensores.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AlertResponseDTO {

    private Long id;
    private String type;
    private String severity;
    private String message;
    private String generatedBy;
    private Integer dataId;
    private Long PlotConditionId;
    private Integer slaveId;
    private LocalDateTime createdAt;
}