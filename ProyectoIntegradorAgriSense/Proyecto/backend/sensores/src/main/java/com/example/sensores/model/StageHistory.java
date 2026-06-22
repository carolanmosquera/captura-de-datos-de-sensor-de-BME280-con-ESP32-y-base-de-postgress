package com.example.sensores.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "stage_history")
public class StageHistory {

    //SE SUPONE QUE ACTUA COMO EL HISTORIAL DE PHENOLOGICAL STAGE 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //FECHA DE CUANDO SE INCIO EL PHENOLOGICAL_STAGE (ETAPA DE PRODUCCION)
    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    //FECHA DE FINALIZACION DE PHENOLOGICAL_STAGE (ETAPA DE PRODUCCION)
    @Column(name = "end_date")
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id", nullable = false)
    @ToString.Exclude
    private PhenologicalStage stage;

    //SE PUEDE HACER UN HISTORIAL DE ETAPAS DE PRODUCCION POR LAS QUE A PASADO
    //UN SECTOR (PLOT)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plot_id", nullable = false)
    @ToString.Exclude
    private Plot plot;
}