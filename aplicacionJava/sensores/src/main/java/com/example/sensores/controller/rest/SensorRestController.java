package com.example.sensores.controller.rest;

import lombok.RequiredArgsConstructor;

import com.example.sensores.model.SensorData;
import com.example.sensores.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rest/telemetry")
@RequiredArgsConstructor
public class SensorRestController {

    private final SensorService sensorService;

    // Endpoint para que el ESP32 envíe datos vía POST
    @PostMapping
    public ResponseEntity<String> receiveTelemetry(@RequestBody SensorData sensorData) {
        try {
            // Asegurar que el timestamp se asigna al momento de la recepción (opcional)
            if (sensorData.getTimestamp() == null) {
                sensorData.setTimestamp(LocalDateTime.now());
            }
            sensorService.save(sensorData);  // Necesitas implementar save en el servicio
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Datos guardados correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar: " + e.getMessage());
        }
    }

    // Endpoint para ver todos los datos (prueba)
    @GetMapping
    public ResponseEntity<Iterable<SensorData>> getAllData() {
        return ResponseEntity.ok(sensorService.findAll()); // Necesitas implementar findAll
    }

    @GetMapping("/last10/{nodeId}")
    public ResponseEntity<List<SensorData>> getLast10(@PathVariable Integer nodeId) {
        return ResponseEntity.ok(sensorService.findTop10ByNodeIdOrderByTimestampDesc(nodeId));
    }

    // Obtener último dato de un nodo específico
    @GetMapping("/last/{nodeId}")
    public ResponseEntity<SensorData> getLastData(@PathVariable Integer nodeId) {
        SensorData data = sensorService.findFirstByNodeIdOrderByTimestampDesc(nodeId);
        if (data == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(data);
    }

}
