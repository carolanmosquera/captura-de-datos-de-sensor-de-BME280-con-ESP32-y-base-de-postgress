package com.example.sensores.repository;

import com.example.sensores.dto.CropResponseDTO;
import com.example.sensores.model.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {

    Optional<Crop> findByName(String name);

    List<Crop> findByPropertyId(Long propertyId);
}