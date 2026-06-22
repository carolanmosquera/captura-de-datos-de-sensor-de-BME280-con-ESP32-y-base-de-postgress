package com.example.sensores.controller.rest;

import com.example.sensores.dto.AlertRequestDTO;
import com.example.sensores.dto.AlertResponseDTO;
import com.example.sensores.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<List<AlertResponseDTO>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlertResponseDTO> getAlertById(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.getAlertById(id));
    }

    @GetMapping("/slave/{slaveId}")
    public ResponseEntity<List<AlertResponseDTO>> getAlertsBySlave(@PathVariable Integer slaveId) {
        return ResponseEntity.ok(alertService.getAlertsBySlave(slaveId));
    }

    @PostMapping
    public ResponseEntity<AlertResponseDTO> createAlert(@Valid @RequestBody AlertRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(alertService.createAlert(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlertResponseDTO> updateAlert(
            @PathVariable Long id,
            @Valid @RequestBody AlertRequestDTO dto) {
        return ResponseEntity.ok(alertService.updateAlert(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }
}