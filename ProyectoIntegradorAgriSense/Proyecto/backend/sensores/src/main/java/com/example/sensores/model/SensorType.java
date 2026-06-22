package com.example.sensores.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@Entity
@Table(name = "sensor_type")
public class SensorType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false, length = 50)
    private String name; // "temperatura", "humedad", "presion", "altitud", "extra"

    @NotBlank
    @Column(nullable = false, length = 20)
    private String unit; // "°C", "%", "hPa", "m", "unidad_extra"


    @OneToMany(mappedBy = "sensorType", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<Sensor> sensorList;
}