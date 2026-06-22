package com.example.sensores.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "alert")
public class Alert extends AuditableEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El tipo de alerta es obligatorio")
    @Column(nullable = false, length = 50)
    private String type;

    @NotBlank(message = "El nivel de severidad es obligatorio")
    @Column(nullable = false, length = 10)
    private String severity;

    @NotBlank(message = "El mensaje de alerta es obligatorio")
    @Column(nullable = false, length = 255)
    private String message;

    @NotBlank(message = "El generador de la alerta es obligatorio")
    @Column(name = "generated_by", nullable = false, length = 10)
    private String generatedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "data_id", nullable = true)
    @ToString.Exclude
    private MeasurementData data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prop_condition_id", nullable = false)
    @ToString.Exclude
    private PlotCondition plotCondition;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slave_id", nullable = false)
    @ToString.Exclude
    private Esp32Slave slave;
}