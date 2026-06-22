package com.example.sensores.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@Entity
@Table(name = "esp32_slave")
public class Esp32Slave {

    @Id
    @NotNull(message = "El nodeId es obligatorio")
    private Integer id;  // Corresponde al nodeId enviado por el esclavo

    @Column(name = "node_status")
    private String nodeStatus;  // "activo" o "inactivo"

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @Column(name = "installation_date", updatable = false)
    private LocalDateTime installationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "master_id", nullable = true)
    @JsonIgnore
    @ToString.Exclude
    private Esp32Master master;

    @OneToMany(mappedBy = "slaveNode")
    @JsonIgnore
    private List<Sensor> sensorList;

    @OneToMany(mappedBy = "slave")
    @JsonIgnore
    private List<MeasurementData> measurementList;

    @OneToMany(mappedBy = "slave")
    @JsonIgnore
    private List<Alert> alerts;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plot_id", nullable = true)
    @ToString.Exclude
    private Plot plot;

    @PrePersist
    protected void onCreate() {
        installationDate = LocalDateTime.now();
        lastSeen = LocalDateTime.now();
        if (nodeStatus == null) nodeStatus = "activo";
    }

    @PreUpdate
    protected void onUpdate() {
        lastSeen = LocalDateTime.now();
    }

    
}