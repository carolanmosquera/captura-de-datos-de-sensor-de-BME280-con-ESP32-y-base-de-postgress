package com.example.sensores.service;

import com.example.sensores.dto.PlotConditionRequestDTO;
import com.example.sensores.dto.PlotConditionResponseDTO;
import java.util.List;

public interface PlotConditionService {
    List<PlotConditionResponseDTO> getAllPlotConditions();
    PlotConditionResponseDTO getPlotConditionById(Long id);
    List<PlotConditionResponseDTO> getPlotConditionsByPlot(Long plotId); // ← renombrado
    PlotConditionResponseDTO createPlotCondition(PlotConditionRequestDTO dto);
    PlotConditionResponseDTO updatePlotCondition(Long id, PlotConditionRequestDTO dto);
    void deletePlotCondition(Long id);
}