package com.example.sensores.service;

import com.example.sensores.dto.AlertRequestDTO;
import com.example.sensores.dto.AlertResponseDTO;
import java.util.List;

public interface AlertService {

    List<AlertResponseDTO> getAllAlerts();
    AlertResponseDTO getAlertById(Long id);
    List<AlertResponseDTO> getAlertsBySlave(Integer slaveId);
    List<AlertResponseDTO> getAlertsByPlotCondition(Long plotConditionId); // ← renombrado
    AlertResponseDTO createAlert(AlertRequestDTO dto);
    AlertResponseDTO updateAlert(Long id, AlertRequestDTO dto);
    void deleteAlert(Long id);
}