package com.example.sensores.service.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.sensores.model.Esp32Slave;
import com.example.sensores.model.Sensor;
import com.example.sensores.repository.Esp32SlaveRepository;
import com.example.sensores.repository.SensorRepository;
import com.example.sensores.service.SensorService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SensorServiceImpl implements SensorService{

    private final SensorRepository sensorRepo;
    private final Esp32SlaveRepository slaveRepo;

    @Override
    public List<Sensor> getSensorsBySlave(Integer slaveId) {
        Esp32Slave slave = slaveRepo.findById(slaveId)
            .orElseThrow(() -> new EntityNotFoundException(
                "Nodo esclavo no encontrado con ID: " + slaveId));
        return sensorRepo.findBySlaveNode(slave);
    }

    
}
