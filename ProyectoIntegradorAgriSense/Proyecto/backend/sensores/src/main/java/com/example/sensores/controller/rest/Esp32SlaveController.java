package com.example.sensores.controller.rest;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sensores.dto.Esp32SlaveDTO;
import com.example.sensores.model.Esp32Slave;
import com.example.sensores.service.Esp32MasterService;
import com.example.sensores.service.Esp32SlaveService;
import com.example.sensores.service.MeasurementDataService;
import com.example.sensores.service.SensorService;
import com.example.sensores.service.SensorTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/slave")
@RequiredArgsConstructor
public class Esp32SlaveController {

    private final Esp32SlaveService esp32SlaveService;

    @GetMapping("/masters/{masterId}")
    public ResponseEntity<List<Esp32SlaveDTO>> getSlaves(@PathVariable Integer masterId) {
        return ResponseEntity.ok(esp32SlaveService.getSlavesByMaster(masterId));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Esp32SlaveDTO>> getAvailableSlaves() {
        return ResponseEntity.ok(esp32SlaveService.getAvailableSlaves());
    }

    @PatchMapping("/{slaveId}/assign-plot")
    public ResponseEntity<Esp32SlaveDTO> assignSlaveToPlot(
            @PathVariable Integer slaveId,
            @RequestBody Map<String, Long> payload) {
        Long plotId = payload.get("plotId");
        if (plotId == null) {
            throw new IllegalArgumentException("plotId is required");
        }
        return ResponseEntity.ok(esp32SlaveService.assignSlaveToPlot(slaveId, plotId));
    }

    @GetMapping("/plot/{plotId}")
    public ResponseEntity<List<Esp32SlaveDTO>> getSlavesByPlot(@PathVariable Long plotId) {
        return ResponseEntity.ok(esp32SlaveService.getSlavesByPlot(plotId));
    }
    
}
