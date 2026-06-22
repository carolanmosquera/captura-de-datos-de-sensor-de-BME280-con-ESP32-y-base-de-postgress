package com.example.sensores.service;

import com.example.sensores.dto.PlotRequestDTO;
import com.example.sensores.dto.PlotResponseDTO;
import java.util.List;

public interface PlotService {

    List<PlotResponseDTO> getAllPlots();
    PlotResponseDTO getPlotById(Long id);
    List<PlotResponseDTO> getPlotsByProperty(Long propertyId);
    PlotResponseDTO createPlot(PlotRequestDTO dto);
    PlotResponseDTO updatePlot(Long id, PlotRequestDTO dto);
    void deletePlot(Long id);
    List<PlotResponseDTO> getPlotsByCrop(Long cropId);  
    
}