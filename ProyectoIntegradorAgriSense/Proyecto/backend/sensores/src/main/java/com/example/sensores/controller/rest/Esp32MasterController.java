package com.example.sensores.controller.rest;

import com.example.sensores.model.Esp32Master;
import com.example.sensores.service.Esp32MasterService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sensores.service.Esp32MasterService;
import com.example.sensores.service.Esp32SlaveService;
import com.example.sensores.service.MeasurementDataService;
import com.example.sensores.service.SensorService;
import com.example.sensores.service.SensorTypeService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/master")
@RequiredArgsConstructor
public class Esp32MasterController {

    private final Esp32MasterService esp32MasterService;

    @GetMapping()
    @Transactional
    public ResponseEntity<List<Esp32Master>> getMasters() {
        return ResponseEntity.ok(esp32MasterService.getAllMasters());
    }
    
}
