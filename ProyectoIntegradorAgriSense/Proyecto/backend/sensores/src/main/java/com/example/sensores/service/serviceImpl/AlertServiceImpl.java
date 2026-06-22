package com.example.sensores.service.serviceImpl;

import com.example.sensores.dto.AlertRequestDTO;
import com.example.sensores.dto.AlertResponseDTO;
import com.example.sensores.model.Alert;
import com.example.sensores.model.PlotCondition;   // ← renombrado
import com.example.sensores.model.Esp32Slave;
import com.example.sensores.model.MeasurementData;
import com.example.sensores.repository.AlertRepository;
import com.example.sensores.repository.PlotConditionRepository; // ← renombrado
import com.example.sensores.repository.Esp32SlaveRepository;
import com.example.sensores.repository.MeasurementDataRepository;
import com.example.sensores.service.AlertService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;
    private final PlotConditionRepository plotConditionRepository; // ← renombrado
    private final Esp32SlaveRepository slaveRepository;
    private final MeasurementDataRepository measurementDataRepository;

    @Override
    public List<AlertResponseDTO> getAllAlerts() {
        return alertRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public AlertResponseDTO getAlertById(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Alerta no encontrada con ID: " + id));
        return toResponseDTO(alert);
    }

    @Override
    public List<AlertResponseDTO> getAlertsBySlave(Integer slaveId) {
        return alertRepository.findBySlave_Id(slaveId).stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<AlertResponseDTO> getAlertsByPlotCondition(Long plotConditionId) { // ← renombrado
        return alertRepository.findByPlotCondition_Id(plotConditionId).stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public AlertResponseDTO createAlert(AlertRequestDTO dto) {
        PlotCondition plotCondition = plotConditionRepository.findById(dto.getPlotConditionId()) // ← espera que DTO tenga plotConditionId
                .orElseThrow(() -> new EntityNotFoundException("Condición de lote no encontrada con ID: " + dto.getPlotConditionId()));
        Esp32Slave slave = slaveRepository.findById(dto.getSlaveId())
                .orElseThrow(() -> new EntityNotFoundException("Nodo esclavo no encontrado con ID: " + dto.getSlaveId()));

        Alert alert = new Alert();
        alert.setType(dto.getType());
        alert.setSeverity(dto.getSeverity());
        alert.setMessage(dto.getMessage());
        alert.setGeneratedBy(dto.getGeneratedBy());
        alert.setPlotCondition(plotCondition); // ← renombrado
        alert.setSlave(slave);

        if (dto.getDataId() != null) {
            MeasurementData data = measurementDataRepository.findById(dto.getDataId())
                    .orElseThrow(() -> new EntityNotFoundException("MeasurementData no encontrado con ID: " + dto.getDataId()));
            alert.setData(data);
        }

        return toResponseDTO(alertRepository.save(alert));
    }

    @Override
    public AlertResponseDTO updateAlert(Long id, AlertRequestDTO dto) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Alerta no encontrada con ID: " + id));

        PlotCondition plotCondition = plotConditionRepository.findById(dto.getPlotConditionId())
                .orElseThrow(() -> new EntityNotFoundException("Condición de lote no encontrada con ID: " + dto.getPlotConditionId()));
        Esp32Slave slave = slaveRepository.findById(dto.getSlaveId())
                .orElseThrow(() -> new EntityNotFoundException("Nodo esclavo no encontrado con ID: " + dto.getSlaveId()));

        alert.setType(dto.getType());
        alert.setSeverity(dto.getSeverity());
        alert.setMessage(dto.getMessage());
        alert.setGeneratedBy(dto.getGeneratedBy());
        alert.setPlotCondition(plotCondition);
        alert.setSlave(slave);

        if (dto.getDataId() != null) {
            MeasurementData data = measurementDataRepository.findById(dto.getDataId())
                    .orElseThrow(() -> new EntityNotFoundException("MeasurementData no encontrado con ID: " + dto.getDataId()));
            alert.setData(data);
        } else {
            alert.setData(null);
        }

        return toResponseDTO(alertRepository.save(alert));
    }

    @Override
    public void deleteAlert(Long id) {
        if (!alertRepository.existsById(id)) throw new EntityNotFoundException("Alerta no encontrada con ID: " + id);
        alertRepository.deleteById(id);
    }

    private AlertResponseDTO toResponseDTO(Alert alert) {
        AlertResponseDTO dto = new AlertResponseDTO();
        dto.setId(alert.getId());
        dto.setType(alert.getType());
        dto.setSeverity(alert.getSeverity());
        dto.setMessage(alert.getMessage());
        dto.setGeneratedBy(alert.getGeneratedBy());
        dto.setCreatedAt(alert.getCreatedAt());
        if (alert.getData() != null) dto.setDataId(alert.getData().getId());
        if (alert.getPlotCondition() != null) dto.setPlotConditionId(alert.getPlotCondition().getId()); // ← renombrado
        if (alert.getSlave() != null) dto.setSlaveId(alert.getSlave().getId());
        return dto;
    }
}