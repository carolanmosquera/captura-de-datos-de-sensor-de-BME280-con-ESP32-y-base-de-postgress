package com.example.sensores.controller.rest;

import com.example.sensores.dto.PlotRequestDTO;
import com.example.sensores.dto.PlotResponseDTO;
import com.example.sensores.service.PlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/plots")
@RequiredArgsConstructor
public class PlotController {

    private final PlotService plotService;

    @GetMapping
    public ResponseEntity<List<PlotResponseDTO>> getAllPlots() {
        return ResponseEntity.ok(plotService.getAllPlots());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlotResponseDTO> getPlotById(@PathVariable Long id) {
        return ResponseEntity.ok(plotService.getPlotById(id));
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<PlotResponseDTO>> getPlotsByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(plotService.getPlotsByProperty(propertyId));
    }

    @PostMapping
    public ResponseEntity<PlotResponseDTO> createPlot(@Valid @RequestBody PlotRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(plotService.createPlot(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlotResponseDTO> updatePlot(
            @PathVariable Long id,
            @Valid @RequestBody PlotRequestDTO dto) {
        return ResponseEntity.ok(plotService.updatePlot(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlot(@PathVariable Long id) {
        plotService.deletePlot(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/crop/{cropId}")
    public ResponseEntity<List<PlotResponseDTO>> getPlotsByCrop(@PathVariable Long cropId) {
        return ResponseEntity.ok(plotService.getPlotsByCrop(cropId));
    }

    
}