package com.example.sensores.repository;

import com.example.sensores.model.Plot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlotRepository extends JpaRepository<Plot, Long> {

    List<Plot> findByProperty_Id(Long propertyId);
    List<Plot> findByCrop_Id(Long cropId);
}