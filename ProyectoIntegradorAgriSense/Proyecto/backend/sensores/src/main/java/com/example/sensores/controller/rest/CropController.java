package com.example.sensores.controller.rest;

import com.example.sensores.dto.CropRequestDTO;
import com.example.sensores.dto.CropResponseDTO;
import com.example.sensores.service.CropService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropController {

    private final CropService cropService;

    @GetMapping
    public ResponseEntity<List<CropResponseDTO>> getAllCrops() {
        return ResponseEntity.ok(cropService.getAllCrops());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CropResponseDTO> getCropById(@PathVariable Long id) {
        return ResponseEntity.ok(cropService.getCropById(id));
    }

    /**
     * Devuelve los cultivos únicos asociados a una propiedad,
     * derivados a través de los lotes (plots) que pertenecen a esa propiedad.
     * Ruta: GET /api/crops/property/{propertyId}
     */
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<CropResponseDTO>> getCropsByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(cropService.getCropsByProperty(propertyId));
    }

    @PostMapping
    public ResponseEntity<CropResponseDTO> createCrop(@Valid @RequestBody CropRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cropService.createCrop(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CropResponseDTO> updateCrop(
            @PathVariable Long id,
            @Valid @RequestBody CropRequestDTO dto) {
        return ResponseEntity.ok(cropService.updateCrop(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrop(@PathVariable Long id) {
        cropService.deleteCrop(id);
        return ResponseEntity.noContent().build();
    }

}