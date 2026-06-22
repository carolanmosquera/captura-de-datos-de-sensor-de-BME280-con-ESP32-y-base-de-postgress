package com.example.sensores.service.serviceImpl;

import com.example.sensores.dto.PlotConditionRequestDTO;
import com.example.sensores.dto.PlotConditionResponseDTO;
import com.example.sensores.model.Plot;
import com.example.sensores.model.PlotCondition;
import com.example.sensores.model.PhenologicalStage;
import com.example.sensores.repository.PlotConditionRepository;
import com.example.sensores.repository.PlotRepository;
import com.example.sensores.repository.PhenologicalStageRepository;
import com.example.sensores.service.PlotConditionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlotConditionServiceImpl implements PlotConditionService {

    private final PlotConditionRepository plotConditionRepository;
    private final PlotRepository plotRepository;          // ← para buscar el Plot
    private final PhenologicalStageRepository stageRepository;

    @Override
    public List<PlotConditionResponseDTO> getAllPlotConditions() {
        return plotConditionRepository.findAll()
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public PlotConditionResponseDTO getPlotConditionById(Long id) {
        PlotCondition pc = plotConditionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Condición de lote no encontrada con ID: " + id));
        return toResponseDTO(pc);
    }

    @Override
    public List<PlotConditionResponseDTO> getPlotConditionsByPlot(Long plotId) {
        return plotConditionRepository.findByPlot_Id(plotId)  // ← método del repositorio actualizado
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public PlotConditionResponseDTO createPlotCondition(PlotConditionRequestDTO dto) {
        // Verificar si el lote ya tiene una condición
        List<PlotCondition> existing = plotConditionRepository.findByPlot_Id(dto.getPlotId());
        if (!existing.isEmpty()) {
            throw new RuntimeException("El lote ya tiene una condición registrada. Use edición en lugar de crear una nueva.");
        }

        Plot plot = plotRepository.findById(dto.getPlotId())
                .orElseThrow(() -> new EntityNotFoundException("Lote no encontrado con ID: " + dto.getPlotId()));
        PhenologicalStage stage = stageRepository.findById(dto.getStageId())
                .orElseThrow(() -> new EntityNotFoundException("Etapa fenológica no encontrada con ID: " + dto.getStageId()));

        PlotCondition pc = new PlotCondition();
        pc.setPlot(plot);               // ← relación con Plot
        pc.setMinTemperature(dto.getMinTemperature());
        pc.setMaxTemperature(dto.getMaxTemperature());
        pc.setMinHumidity(dto.getMinHumidity());
        pc.setMaxHumidity(dto.getMaxHumidity());
        pc.setStage(stage);

        return toResponseDTO(plotConditionRepository.save(pc));
    }

    @Override
    public PlotConditionResponseDTO updatePlotCondition(Long id, PlotConditionRequestDTO dto) {
        PlotCondition pc = plotConditionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Condición de lote no encontrada con ID: " + id));

        Plot plot = plotRepository.findById(dto.getPlotId())
                .orElseThrow(() -> new EntityNotFoundException("Lote no encontrado con ID: " + dto.getPlotId()));
        PhenologicalStage stage = stageRepository.findById(dto.getStageId())
                .orElseThrow(() -> new EntityNotFoundException("Etapa fenológica no encontrada con ID: " + dto.getStageId()));

        pc.setPlot(plot);
        pc.setMinTemperature(dto.getMinTemperature());
        pc.setMaxTemperature(dto.getMaxTemperature());
        pc.setMinHumidity(dto.getMinHumidity());
        pc.setMaxHumidity(dto.getMaxHumidity());
        pc.setStage(stage);

        return toResponseDTO(plotConditionRepository.save(pc));
    }

    @Override
    public void deletePlotCondition(Long id) {
        if (!plotConditionRepository.existsById(id)) {
            throw new EntityNotFoundException("Condición de lote no encontrada con ID: " + id);
        }
        plotConditionRepository.deleteById(id);
    }

    private PlotConditionResponseDTO toResponseDTO(PlotCondition pc) {
        PlotConditionResponseDTO dto = new PlotConditionResponseDTO();
        dto.setId(pc.getId());
        dto.setMinTemperature(pc.getMinTemperature());
        dto.setMaxTemperature(pc.getMaxTemperature());
        dto.setMinHumidity(pc.getMinHumidity());
        dto.setMaxHumidity(pc.getMaxHumidity());
        if (pc.getPlot() != null) {
            dto.setPlotId(pc.getPlot().getId());
            dto.setPlotName(pc.getPlot().getName());
        }
        if (pc.getStage() != null) {
            dto.setStageId(pc.getStage().getId());
            dto.setStageName(pc.getStage().getName());
        }
        return dto;
    }
}