package com.example.sensores.repository;

import com.example.sensores.model.PlotCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlotConditionRepository extends JpaRepository<PlotCondition, Long> {

    // Cambia de crop a plot
    List<PlotCondition> findByPlot_Id(Long plotId);
    
    List<PlotCondition> findByStage_Id(Long stageId);
}