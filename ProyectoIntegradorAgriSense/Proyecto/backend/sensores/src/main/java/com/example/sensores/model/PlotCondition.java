package com.example.sensores.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "plot_condition", indexes = @Index(name = "idx_plot_condition_plot", columnList = "plot_id"), uniqueConstraints = @UniqueConstraint(columnNames = "plot_id"))
public class PlotCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //un cropCondiction se relaciona con un crop 
    //si un crop es considerado un almacen
    //un almacen tiene varios cuartos (por lo que cada cuarto (plot) tiene su propia condicion)
    //EN VEZ DE UNA RELACION CON CROP DEBERIA SER CON PLOT
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plot_id", nullable = false)
    private Plot plot;

    @NotNull(message = "La temperatura mínima es obligatoria")
    @Column(name = "min_temperature", nullable = false)
    private Double minTemperature;

    @NotNull(message = "La temperatura máxima es obligatoria")
    @Column(name = "max_temperature", nullable = false)
    private Double maxTemperature;

    @NotNull(message = "La humedad mínima es obligatoria")
    @Column(name = "min_humidity", nullable = false)
    private Double minHumidity;

    @NotNull(message = "La humedad máxima es obligatoria")
    @Column(name = "max_humidity", nullable = false)
    private Double maxHumidity;

    //el crop condicition tambien se relaciona por etapa de produccion para poder agrupamientos
    @NotNull(message = "La etapa fenológica es obligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id", nullable = false)
    @ToString.Exclude
    private PhenologicalStage stage;

    @OneToMany(mappedBy = "plotCondition", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<Alert> alerts;

    @AssertTrue(message = "La temperatura mínima debe ser menor que la máxima")
    @JsonIgnore
    public boolean isTemperatureRangeValid() {
        return minTemperature == null || maxTemperature == null
            || minTemperature < maxTemperature;
    }

    @AssertTrue(message = "La humedad mínima debe ser menor que la máxima")
    @JsonIgnore
    public boolean isHumidityRangeValid() {
        return minHumidity == null || maxHumidity == null
            || minHumidity < maxHumidity;
    }


}