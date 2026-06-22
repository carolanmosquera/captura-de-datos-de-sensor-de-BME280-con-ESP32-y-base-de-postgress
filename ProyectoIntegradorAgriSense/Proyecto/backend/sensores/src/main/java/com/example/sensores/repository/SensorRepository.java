package com.example.sensores.repository;

import com.example.sensores.model.Esp32Slave;
import com.example.sensores.model.Sensor;
import com.example.sensores.model.SensorData;
import com.example.sensores.model.SensorType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SensorRepository extends JpaRepository<Sensor, Integer> {

    Optional<Sensor> findBySlaveNodeAndSensorType(Esp32Slave slave, SensorType sensorType);
    List<Sensor> findBySlaveNode(Esp32Slave slave);
    
}
