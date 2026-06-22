package com.example.sensores.service.serviceImpl;

import com.example.sensores.dto.PlotRequestDTO;
import com.example.sensores.dto.PlotResponseDTO;
import com.example.sensores.model.Crop;
import com.example.sensores.model.Plot;
import com.example.sensores.model.Property;
import com.example.sensores.repository.CropRepository;
import com.example.sensores.repository.PlotRepository;
import com.example.sensores.repository.PropertyRepository;
import com.example.sensores.service.PlotService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlotServiceImpl implements PlotService {

    private final PlotRepository plotRepository;
    private final PropertyRepository propertyRepository;
    private final CropRepository cropRepository;
    // private final LocationRepository locationRepository; ← ya no se usa

    @Override
    public List<PlotResponseDTO> getAllPlots() {
        return plotRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public PlotResponseDTO getPlotById(Long id) {
        Plot plot = plotRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lote no encontrado con ID: " + id));
        return toResponseDTO(plot);
    }

    @Override
    public List<PlotResponseDTO> getPlotsByProperty(Long propertyId) {
        return plotRepository.findByProperty_Id(propertyId)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public PlotResponseDTO createPlot(PlotRequestDTO dto) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new EntityNotFoundException("Propiedad no encontrada con ID: " + dto.getPropertyId()));
        Crop crop = cropRepository.findById(dto.getCropId())
                .orElseThrow(() -> new EntityNotFoundException("Cultivo no encontrado con ID: " + dto.getCropId()));

        Plot plot = new Plot();
        plot.setName(dto.getName());
        plot.setArea(dto.getArea());
        plot.setProperty(property);
        plot.setCrop(crop);
        // plot.setLocation(...) ← eliminado
        // Nuevos campos opcionales
        plot.setHasMaster(dto.getHasMaster() != null ? dto.getHasMaster() : false);
        // Si se asigna un master (por ID), se puede buscar y asignar
        // if (dto.getMasterId() != null) { ... }

        return toResponseDTO(plotRepository.save(plot));
    }

    @Override
    public PlotResponseDTO updatePlot(Long id, PlotRequestDTO dto) {
        Plot plot = plotRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lote no encontrado con ID: " + id));

        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new EntityNotFoundException("Propiedad no encontrada con ID: " + dto.getPropertyId()));
        Crop crop = cropRepository.findById(dto.getCropId())
                .orElseThrow(() -> new EntityNotFoundException("Cultivo no encontrado con ID: " + dto.getCropId()));

        plot.setName(dto.getName());
        plot.setArea(dto.getArea());
        plot.setProperty(property);
        plot.setCrop(crop);
        // plot.setLocation(...) ← eliminado
        plot.setHasMaster(dto.getHasMaster() != null ? dto.getHasMaster() : plot.getHasMaster());
        // Actualizar master si se proporciona

        return toResponseDTO(plotRepository.save(plot));
    }

    @Override
    public void deletePlot(Long id) {
        if (!plotRepository.existsById(id)) throw new EntityNotFoundException("Lote no encontrado con ID: " + id);
        plotRepository.deleteById(id);
    }

    private PlotResponseDTO toResponseDTO(Plot plot) {
        PlotResponseDTO dto = new PlotResponseDTO();
        dto.setId(plot.getId());
        dto.setName(plot.getName());
        dto.setArea(plot.getArea());
        if (plot.getProperty() != null) {
            dto.setPropertyId(plot.getProperty().getId());
            dto.setPropertyName(plot.getProperty().getName());
        }
        if (plot.getCrop() != null) {
            dto.setCropId(plot.getCrop().getId());
            dto.setCropName(plot.getCrop().getName());
        }
        // Ubicación eliminada de Plot, por lo tanto no se incluye
        dto.setHasMaster(plot.getHasMaster());
        // Opcional: si quieres incluir masterId, agrega campo en DTO
        return dto;
    }

    @Override
    public List<PlotResponseDTO> getPlotsByCrop(Long cropId) {
        return plotRepository.findByCrop_Id(cropId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}