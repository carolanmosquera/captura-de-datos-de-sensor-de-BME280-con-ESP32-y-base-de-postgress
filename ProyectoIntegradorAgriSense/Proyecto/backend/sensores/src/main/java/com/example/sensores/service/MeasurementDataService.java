package com.example.sensores.service;

import java.util.List;

import com.example.sensores.model.MeasurementData;

public interface MeasurementDataService {

    public List<MeasurementData> getLastMeasurements(Integer slaveId, int limit);
    
}
