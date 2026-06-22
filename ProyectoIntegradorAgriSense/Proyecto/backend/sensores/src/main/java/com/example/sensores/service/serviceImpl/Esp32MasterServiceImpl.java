package com.example.sensores.service.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.sensores.model.Esp32Master;
import com.example.sensores.repository.Esp32MasterRepository;
import com.example.sensores.service.Esp32MasterService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class Esp32MasterServiceImpl implements Esp32MasterService{

    private final Esp32MasterRepository masterRepo;
    
    @Override
     public List<Esp32Master> getAllMasters() {
        return masterRepo.findAll();
    }
    
}
