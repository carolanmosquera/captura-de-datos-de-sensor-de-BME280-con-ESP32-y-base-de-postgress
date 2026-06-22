package com.example.sensores.service.serviceImpl;

import com.example.sensores.dto.NotificationRequestDTO;
import com.example.sensores.dto.NotificationResponseDTO;
import com.example.sensores.model.Alert;
import com.example.sensores.model.Notification;
import com.example.sensores.model.User;
import com.example.sensores.repository.AlertRepository;
import com.example.sensores.repository.NotificationRepository;
import com.example.sensores.repository.UserRepository;
import com.example.sensores.service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final AlertRepository alertRepository;

    @Override
    public List<NotificationResponseDTO> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationResponseDTO getNotificationById(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notificación no encontrada con ID: " + id));
        return toResponseDTO(n);
    }

    @Override
    public List<NotificationResponseDTO> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUser_Id(userId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationResponseDTO createNotification(NotificationRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + dto.getUserId()));
        Alert alert = alertRepository.findById(dto.getAlertId())
                .orElseThrow(() -> new EntityNotFoundException("Alerta no encontrada con ID: " + dto.getAlertId()));

        Notification notification = new Notification();
        notification.setMessage(dto.getMessage());
        notification.setReadStatus(dto.getReadStatus());
        notification.setUser(user);
        notification.setAlert(alert);

        return toResponseDTO(notificationRepository.save(notification));
    }

    @Override
    public NotificationResponseDTO updateNotification(Long id, NotificationRequestDTO dto) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notificación no encontrada con ID: " + id));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + dto.getUserId()));
        Alert alert = alertRepository.findById(dto.getAlertId())
                .orElseThrow(() -> new EntityNotFoundException("Alerta no encontrada con ID: " + dto.getAlertId()));

        notification.setMessage(dto.getMessage());
        notification.setReadStatus(dto.getReadStatus());
        notification.setUser(user);
        notification.setAlert(alert);

        return toResponseDTO(notificationRepository.save(notification));
    }

    @Override
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new EntityNotFoundException("Notificación no encontrada con ID: " + id);
        }
        notificationRepository.deleteById(id);
    }

    private NotificationResponseDTO toResponseDTO(Notification n) {
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(n.getId());
        dto.setMessage(n.getMessage());
        dto.setReadStatus(n.getReadStatus());
        dto.setCreatedAt(n.getCreatedAt());
        if (n.getUser() != null) {
            dto.setUserId(n.getUser().getId());
            dto.setUserName(n.getUser().getName());
        }
        if (n.getAlert() != null) {
            dto.setAlertId(n.getAlert().getId());
        }
        return dto;
    }
}