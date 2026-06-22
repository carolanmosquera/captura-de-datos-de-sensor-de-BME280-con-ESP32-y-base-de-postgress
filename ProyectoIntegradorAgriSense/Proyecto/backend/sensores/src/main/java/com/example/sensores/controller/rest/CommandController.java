package com.example.sensores.controller.rest;

import com.example.sensores.service.serviceImpl.MqttCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/commands")
@RequiredArgsConstructor
public class CommandController {
    
    private final MqttCommandService mqttCommandService;

    //endpoint para nodo especifico 

    // POST /api/commands/node/2/pause
    // POST /api/commands/node/2/resume
    @PostMapping("/node/{nodeId}/{action}")
    public ResponseEntity<String> commandNode(
            @PathVariable Integer nodeId,
            @PathVariable String action) {
        try {
            String command = action.equalsIgnoreCase("pause") ? "PAUSE" : "RESUME";
            mqttCommandService.sendCommand(nodeId, command);
            return ResponseEntity.ok("Comando '" + command + "' enviado al nodo " + nodeId);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    //endpoint para todos
    // POST /api/commands/all/pause  →  pausa todos
    @PostMapping("/all/{action}")
    public ResponseEntity<String> commandAll(@PathVariable String action) {
        try {
            String command = action.equalsIgnoreCase("pause") ? "PAUSE" : "RESUME";
            mqttCommandService.sendCommand(null, command);
            return ResponseEntity.ok("Comando '" + command + "' enviado a todos los nodos");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
