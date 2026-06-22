package com.example.sensores.repository;

import com.example.sensores.model.Esp32Slave;
import com.example.sensores.model.SensorData;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface Esp32SlaveRepository extends JpaRepository<Esp32Slave, Integer>  {
    
     @EntityGraph(attributePaths = {"plot"})
    List<Esp32Slave> findByMaster_Id(Integer masterId);  // slaves de un master

    List<Esp32Slave> findByPlotIsNullAndNodeStatus(String nodeStatus);

    List<Esp32Slave> findByPlotId(Long plotId);
    
}
