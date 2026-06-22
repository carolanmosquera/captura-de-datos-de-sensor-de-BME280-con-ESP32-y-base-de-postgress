package com.example.sensores.controller.rest;

import com.example.sensores.dto.PlotConditionRequestDTO;
import com.example.sensores.dto.PlotConditionResponseDTO;
import com.example.sensores.service.PlotConditionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/plot-conditions")  
@RequiredArgsConstructor
public class PlotConditionController {

    private final PlotConditionService plotConditionService;

    @GetMapping
    public ResponseEntity<List<PlotConditionResponseDTO>> getAllCropConditions() {
        return ResponseEntity.ok(plotConditionService.getAllPlotConditions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlotConditionResponseDTO> getCropConditionById(@PathVariable Long id) {
        return ResponseEntity.ok(plotConditionService.getPlotConditionById(id));
    }

    @GetMapping("/plot/{plotId}")   
    public ResponseEntity<List<PlotConditionResponseDTO>> getPlotConditionsByPlot(@PathVariable Long plotId) {
        return ResponseEntity.ok(plotConditionService.getPlotConditionsByPlot(plotId));
    }

    @PostMapping
    public ResponseEntity<PlotConditionResponseDTO> createCropCondition(
            @Valid @RequestBody PlotConditionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(plotConditionService.createPlotCondition(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlotConditionResponseDTO> updateCropCondition(
            @PathVariable Long id,
            @Valid @RequestBody PlotConditionRequestDTO dto) {
        return ResponseEntity.ok(plotConditionService.updatePlotCondition(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCropCondition(@PathVariable Long id) {
        plotConditionService.deletePlotCondition(id);;
        return ResponseEntity.noContent().build();
    }
}