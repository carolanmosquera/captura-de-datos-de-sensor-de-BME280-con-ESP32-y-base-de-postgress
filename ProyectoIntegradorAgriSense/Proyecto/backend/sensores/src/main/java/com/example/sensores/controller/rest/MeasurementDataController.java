package com.example.sensores.controller.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.sensores.model.MeasurementData;
import com.example.sensores.service.Esp32MasterService;
import com.example.sensores.service.Esp32SlaveService;
import com.example.sensores.service.MeasurementDataService;
import com.example.sensores.service.SensorService;
import com.example.sensores.service.SensorTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/measurement")
@RequiredArgsConstructor
public class MeasurementDataController {

    private final MeasurementDataService measurementDataService;
    
    //porque la measurement va segun los slaves
    @GetMapping("/slaves/{slaveId}")
    public ResponseEntity<List<MeasurementData>> getMeasurements(
            @PathVariable Integer slaveId,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(measurementDataService.getLastMeasurements(slaveId, limit));
    }
}
