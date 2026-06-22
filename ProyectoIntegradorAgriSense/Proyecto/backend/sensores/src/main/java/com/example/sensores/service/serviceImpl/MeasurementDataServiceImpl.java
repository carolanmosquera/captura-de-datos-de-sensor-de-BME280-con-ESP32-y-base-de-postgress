package com.example.sensores.service.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.sensores.model.Esp32Slave;
import com.example.sensores.model.MeasurementData;
import com.example.sensores.repository.Esp32SlaveRepository;
import com.example.sensores.repository.MeasurementDataRepository;
import com.example.sensores.service.MeasurementDataService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MeasurementDataServiceImpl implements MeasurementDataService{

    private final MeasurementDataRepository measurementRepo;
    private final Esp32SlaveRepository slaveRepo;

    public List<MeasurementData> getLastMeasurements(Integer slaveId, int limit) {
        Esp32Slave slave = slaveRepo.findById(slaveId).orElseThrow();
        if (limit <= 0) limit = 10;
        return measurementRepo.findTop10BySlaveOrderByTimestampDesc(slave);
    }
    
}
