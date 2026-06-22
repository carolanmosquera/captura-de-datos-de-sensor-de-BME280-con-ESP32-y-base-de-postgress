package com.example.sensores.service;

import java.util.List;

import com.example.sensores.model.Sensor;

public interface SensorService {

    public List<Sensor> getSensorsBySlave(Integer slaveId);
    
}
