package com.example.sensores.service.serviceImpl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.sensores.model.Esp32Master;
import com.example.sensores.model.Esp32Slave;
import com.example.sensores.model.MeasurementData;
import com.example.sensores.model.Sensor;
import com.example.sensores.model.SensorData;
import com.example.sensores.model.SensorType;
import com.example.sensores.repository.Esp32MasterRepository;
import com.example.sensores.repository.Esp32SlaveRepository;
import com.example.sensores.repository.MeasurementDataRepository;
import com.example.sensores.repository.SensorRepository;
import com.example.sensores.repository.SensorTypeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NormalizationService {

    private final Esp32MasterRepository masterRepo;
    private final Esp32SlaveRepository slaveRepo;
    private final SensorTypeRepository sensorTypeRepo;
    private final SensorRepository sensorRepo;
    private final MeasurementDataRepository measurementRepo;

    //este memtodo es el que se encarga de recibir una entidad sensorData 
    //y crear las otras entidades
    public void processSensorData(SensorData raw) {
        // 1. Master
        //trae una master o si no la crea
        Esp32Master master = masterRepo.findByMac(raw.getMacMaster())
                .orElseGet(() -> {
                    Esp32Master m = new Esp32Master();
                    m.setMac(raw.getMacMaster());
                    return m;
                });
        master.setCanal(raw.getCanalConection());
        master.setLastCommunication(LocalDateTime.now());
        master = masterRepo.save(master);

        // 2. Slave
        //trae una slave o si no la crea
        Esp32Slave slave = slaveRepo.findById(raw.getNodeId())
                .orElseGet(() -> {
                    Esp32Slave s = new Esp32Slave();
                    s.setId(raw.getNodeId());
                    return s;
                });
        slave.setNodeStatus(raw.getNodeStatus());
        slave.setLastSeen(LocalDateTime.now());
        slave.setMaster(master);   // actualizar relación con el master
        slave = slaveRepo.save(slave);

        // 3. Para cada tipo de sensor, actualizar o crear el registro en Sensor (solo status)
        if (raw.getTemperature() != null) updateSensorStatus(slave, "temperatura", raw.getSensorStatus());
        if (raw.getHumidity() != null) updateSensorStatus(slave, "humedad", raw.getSensorStatus());
        if (raw.getPressure() != null) updateSensorStatus(slave, "presion", raw.getSensorStatus());
        if (raw.getAltitude() != null) updateSensorStatus(slave, "altitud", raw.getSensorStatus());
        if (raw.getExtraVariable() != null) updateSensorStatus(slave, "extra", raw.getSensorStatus());

        // 4. Guardar medición (valores completos) en MeasurementData
        MeasurementData measurement = new MeasurementData();
        measurement.setSlave(slave);
        measurement.setTemperature(raw.getTemperature());
        measurement.setHumidity(raw.getHumidity());
        measurement.setPressure(raw.getPressure());
        measurement.setAltitude(raw.getAltitude());
        measurement.setExtraVariable(raw.getExtraVariable());
        measurement.setTimestamp(raw.getTimestamp());
        measurementRepo.save(measurement);
    }

    private void updateSensorStatus(Esp32Slave slave, String sensorTypeName, Integer status) {
        SensorType type = sensorTypeRepo.findByName(sensorTypeName)
                .orElseThrow(() -> new RuntimeException("SensorType no encontrado: " + sensorTypeName));
        Sensor sensor = sensorRepo.findBySlaveNodeAndSensorType(slave, type)
                .orElseGet(() -> {
                    Sensor s = new Sensor();
                    s.setSlaveNode(slave);
                    s.setSensorType(type);
                    return s;
                });
        sensor.setSensorStatus(status);
        sensor.setLastUpdate(LocalDateTime.now());
        sensorRepo.save(sensor);
    }
    
}
