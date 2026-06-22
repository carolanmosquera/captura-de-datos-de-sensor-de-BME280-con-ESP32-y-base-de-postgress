package com.example.sensores.service;

import com.example.sensores.dto.NotificationRequestDTO;
import com.example.sensores.dto.NotificationResponseDTO;
import java.util.List;

public interface NotificationService {

    List<NotificationResponseDTO> getAllNotifications();
    NotificationResponseDTO getNotificationById(Long id);
    List<NotificationResponseDTO> getNotificationsByUser(Long userId);
    NotificationResponseDTO createNotification(NotificationRequestDTO dto);
    NotificationResponseDTO updateNotification(Long id, NotificationRequestDTO dto);
    void deleteNotification(Long id);
}