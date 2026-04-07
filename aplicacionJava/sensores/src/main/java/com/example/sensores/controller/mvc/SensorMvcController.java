package com.example.sensores.controller.mvc;

import com.example.sensores.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/mvc/telemetry")
@RequiredArgsConstructor
public class SensorMvcController {

    private final SensorService sensorService;

    // Vista principal para seleccionar nodo y mostrar gráfica
    @GetMapping
    public String showDashboard(Model model) {
        // Obtener lista de nodeIds distintos 

        model.addAttribute("nodes", sensorService.findDistinctNodeIds()); // implementar
        return "telemetry/dashboard";
    }

    // API interna para obtener datos en JSON (para la gráfica)
    @GetMapping("/data")
    public String getDataForGraph(@RequestParam Integer nodeId, Model model) {
        
        var data = sensorService.findTop10ByNodeIdOrderByTimestampDesc(nodeId);
        model.addAttribute("nodeId", nodeId);
        model.addAttribute("data", data);
        return "telemetry/data-fragment"; // fragmento HTML o directamente JSON
    }


    
}
