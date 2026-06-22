package com.example.sensores.controller.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sensores.model.PhenologicalStage;
import com.example.sensores.repository.PhenologicalStageRepository;

import lombok.RequiredArgsConstructor;

// PhenologicalStageController.java
@RestController
@RequestMapping("/api/phenological-stages")
@RequiredArgsConstructor
public class PhenologicalStageController {
    private final PhenologicalStageRepository repository;

    @GetMapping
    public ResponseEntity<List<PhenologicalStage>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }
} 
    

