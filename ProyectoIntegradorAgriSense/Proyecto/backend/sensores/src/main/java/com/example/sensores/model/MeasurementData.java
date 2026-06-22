package com.example.sensores.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@Entity
@Table(name = "measurement_data")
public class MeasurementData extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slave_id", nullable = false)
    @JsonIgnore
    private Esp32Slave slave;

    @Column(name = "temperature")
    private Float temperature;

    @Column(name = "humidity")
    private Float humidity;

    @Column(name = "pressure")
    private Float pressure;

    @Column(name = "altitude")
    private Float altitude;

    @Column(name = "extra_variable")
    private Float extraVariable;
    
    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp;

}