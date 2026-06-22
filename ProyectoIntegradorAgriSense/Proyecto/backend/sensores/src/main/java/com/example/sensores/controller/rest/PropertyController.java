package com.example.sensores.controller.rest;

import com.example.sensores.dto.PropertyRequestDTO;
import com.example.sensores.dto.PropertyResponseDTO;
import com.example.sensores.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<PropertyResponseDTO>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<PropertyResponseDTO>> getPropertiesByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(propertyService.getPropertiesByOwner(ownerId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PropertyResponseDTO>> getPropertiesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(propertyService.getPropertiesByOwner(userId));
    }

    @PostMapping
    public ResponseEntity<PropertyResponseDTO> createProperty(@Valid @RequestBody PropertyRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyService.createProperty(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequestDTO dto) {
        return ResponseEntity.ok(propertyService.updateProperty(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
}