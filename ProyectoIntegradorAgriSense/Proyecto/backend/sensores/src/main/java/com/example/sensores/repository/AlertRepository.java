package com.example.sensores.repository;

import com.example.sensores.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findBySlave_Id(Integer slaveId);
    
    // Cambiar de cropCondition a plotCondition
    List<Alert> findByPlotCondition_Id(Long plotConditionId);
    
    List<Alert> findBySeverity(String severity);
}