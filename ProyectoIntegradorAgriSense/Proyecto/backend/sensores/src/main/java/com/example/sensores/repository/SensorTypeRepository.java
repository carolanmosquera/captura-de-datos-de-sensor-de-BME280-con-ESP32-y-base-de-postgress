package com.example.sensores.repository;

import com.example.sensores.model.SensorData;
import com.example.sensores.model.SensorType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SensorTypeRepository extends JpaRepository<SensorType, Integer>{

    Optional<SensorType> findByName(String name);
    
}
