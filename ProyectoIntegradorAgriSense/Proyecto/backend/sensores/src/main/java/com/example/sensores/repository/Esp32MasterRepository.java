package com.example.sensores.repository;

import com.example.sensores.model.Esp32Master;
import com.example.sensores.model.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface Esp32MasterRepository extends JpaRepository<Esp32Master, Integer>{

    Optional<Esp32Master> findByMac(String mac);
    
}
