package com.example.sensores.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor 
@Entity
@Table(name = "esp32_master")
public class Esp32Master {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String mac;

    @Column(name = "canal")
    private Integer canal;

    @Column(name = "last_communication")
    private LocalDateTime lastCommunication;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "master")
    @JsonIgnore
    private List<Esp32Slave> slavesList;

    //EL ESP-32 NO DEBERIA DE IR EN UN CROP (AREA/ALMACEN) SI NO EN UN PLOT(SECTOR/CUARTO)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plot_id", nullable = true)
    @ToString.Exclude
    private Plot plot;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastCommunication = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastCommunication = LocalDateTime.now();
    }
}