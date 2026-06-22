package com.example.sensores.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "phenological_stage") //etapa de produccion (crecimiento)
public class PhenologicalStage {

    //segun etapa de produccion se puede asociar a una condicion
    //para luego ayudar a automatizar configuracion segun etapas de produccion
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la etapa es obligatorio")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 255)
    @Column(length = 255)
    private String description;

    //una etapa de produccion puede tener un historial de cambios o de fases
    @OneToMany(mappedBy = "stage", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<StageHistory> stageHistories;

    //el cropCondiction se relaciona con el phenological stage
    //pero mas como agrupamiento 
    @OneToMany(mappedBy = "stage", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<PlotCondition> plotConditions;
}