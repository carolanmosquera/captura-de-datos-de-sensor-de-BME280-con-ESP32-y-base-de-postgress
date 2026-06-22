package com.example.sensores.service.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.sensores.model.SensorType;
import com.example.sensores.repository.SensorTypeRepository;
import com.example.sensores.service.SensorTypeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SensorTypeServiceImpl implements SensorTypeService{

    private final SensorTypeRepository sensorTypeRepo;

    public List<SensorType> getAllSensorTypes() {
        return sensorTypeRepo.findAll();
    }
    
}
