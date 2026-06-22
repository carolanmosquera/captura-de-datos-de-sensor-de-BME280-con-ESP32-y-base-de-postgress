package com.example.sensores.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationResponseDTO {

    private Long id;
    private String message;
    private String readStatus;
    private Long userId;
    private String userName;
    private Long alertId;
    private LocalDateTime createdAt;
}