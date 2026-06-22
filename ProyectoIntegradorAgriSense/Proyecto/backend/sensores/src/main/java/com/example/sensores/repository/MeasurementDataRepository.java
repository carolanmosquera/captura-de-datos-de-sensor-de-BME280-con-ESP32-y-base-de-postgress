package com.example.sensores.repository;

import com.example.sensores.model.Esp32Slave;
import com.example.sensores.model.MeasurementData;
import com.example.sensores.model.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MeasurementDataRepository extends JpaRepository<MeasurementData, Integer>{

    List<MeasurementData> findTop10BySlaveOrderByTimestampDesc(Esp32Slave slave);
    List<MeasurementData> findBySlaveOrderByTimestampDesc(Esp32Slave slave);
    
}
