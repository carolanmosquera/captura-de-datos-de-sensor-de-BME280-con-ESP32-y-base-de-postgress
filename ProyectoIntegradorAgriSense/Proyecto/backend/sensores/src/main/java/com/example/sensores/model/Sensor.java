package com.example.sensores.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@Entity
@Table(name = "sensor")
public class Sensor extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slave_node", nullable = true)
    @JsonIgnore
    private Esp32Slave slaveNode;

    //@Column(name = "sensor_type_id")
    //private Integer sensorTypeId;  // FK a SensorType.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sensor_type", nullable = true)
    @JsonIgnore
    private SensorType sensorType;

    @Column(name = "sensor_status")
    private Integer sensorStatus;   // 1=OK, 0=falla (último estado conocido)

    @Column(name = "last_update")
    private LocalDateTime lastUpdate;

}