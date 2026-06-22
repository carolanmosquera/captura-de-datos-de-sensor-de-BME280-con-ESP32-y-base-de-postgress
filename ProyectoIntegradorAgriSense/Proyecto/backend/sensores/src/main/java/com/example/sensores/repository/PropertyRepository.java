package com.example.sensores.repository;

import com.example.sensores.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByOwner_Id(Long ownerId);
    List<Property> findByPropertyType_Id(Long propertyTypeId);
    
}