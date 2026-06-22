package com.example.sensores.controller.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sensores.model.Sensor;
import com.example.sensores.model.SensorType;
import com.example.sensores.service.Esp32MasterService;
import com.example.sensores.service.Esp32SlaveService;
import com.example.sensores.service.MeasurementDataService;
import com.example.sensores.service.SensorService;
import com.example.sensores.service.SensorTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sensor")
@RequiredArgsConstructor
public class SensorController {

    private final SensorService sensorService;
    private final SensorTypeService sensorTypeService;

     @GetMapping("/slaves/{slaveId}")
    public ResponseEntity<List<Sensor>> getSensors(@PathVariable Integer slaveId) {
        return ResponseEntity.ok(sensorService.getSensorsBySlave(slaveId));
    }

    @GetMapping("/sensor-types")
    public ResponseEntity<List<SensorType>> getSensorTypes() {
        return ResponseEntity.ok(sensorTypeService.getAllSensorTypes());
    }

    
    
}
