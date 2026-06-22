package com.example.sensores.repository;

import com.example.sensores.model.PhenologicalStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PhenologicalStageRepository extends JpaRepository<PhenologicalStage, Long> {
    Optional<PhenologicalStage> findByName(String name);
}