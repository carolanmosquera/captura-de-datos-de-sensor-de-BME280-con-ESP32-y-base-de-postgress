package com.example.sensores.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import jakarta.persistence.Table;

//ESTA ES LA CLASE CENTRAL QUE RECIBE TODOS LOS DATOS DE LA ESP32, NO TOCAR!!
@Data
@NoArgsConstructor
@Entity
@Table(name = "SensorData")
public class SensorData extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //el node representa el id del ESP32 emisor (captura variables atravez de sensor)
    @Column(name = "node_id")
    private Integer nodeId; 

    private Float temperature;
    private Float humidity;
    private Float pressure;
    private Float altitude;
    
    @Column(name = "extra_variable")
    private Float extraVariable;

    private Integer sensorStatus; // Mapea a "sensorStatus" (PROVIENE DE SLAVE)

    private String nodeStatus;    // Mapea a "nodeStatus proviene de reciber dependiendo de conexion a esclava" 

    @Column(name = "mac_master")
    private String macMaster;      // Para doc["macMaster"]

    @Column(name = "canal_conection")
    private Integer canalConection; // Para doc["canalConection"]

    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp;

    // Guarda la fecha y hora exacta en la que llega el dato
    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now(); 
    }
    
}