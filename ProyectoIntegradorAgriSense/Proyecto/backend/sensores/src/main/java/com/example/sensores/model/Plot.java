package com.example.sensores.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "plot")
public class Plot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del lote es obligatorio")
    @Column(nullable = false, length = 100)
    private String name;

    //un sector (plot) va a pertenercer a un area/almacen (crop), un crop puede tener muchos plot
    @NotNull(message = "El área es obligatoria")
    @Column(nullable = false)
    private Double area;

    //si un sector (plot) es considerado un cuarto, este va tener sus propias condiciones
    //por lo TANTO UN PLOT (DEBERIA DE ESTAR RELACIONADO CON EL CropCondiction)
    //CAMBIAR NOMBRE DE CropCondiction A PlotCondiction

    //como los plot (sectores) Sson las que tienen las condiciones, ESTOS DEBERIAN DE TENER 
    //ASOCIADO O UN ESP32-SLAVE O UN ESP32-MASTER (pueden ser varios)

    //DEBERIA DE HAVER UNA PROPIEDAD BOOLEANA QUE SEA TRUE EN EL CASO QUE EL SECTRO (PLOT)
    //TENGA UN ESP-MASTER YA QUE SERIA CONSIDERADO UN NODO CENTRAL PARA EXTENDER LA RED DE SENSORES
    @Column(name = "has_master", nullable = false)
    private Boolean hasMaster = false;   // si este sector tiene un ESP-Master propio

    // Relación con ESP-Master (un plot puede tener un master)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "master_id")
    @ToString.Exclude
    private Esp32Master master;

    // Relación con ESP-Slave (un plot puede tener varios esclavos)
    @OneToMany(mappedBy = "plot")
    @JsonIgnore
    @ToString.Exclude
    private List<Esp32Slave> slaves;

    //EL PLOT (SECTOR) NO DEBERIA DE TENER RELACION CON PROPIEDAD YA QUE VA RELACIONADO CON CROP (AREA)
    //QUE YA ESTA RELACIONADO CON PROPIEDAD
    //se mantiene lo para logistica de agrupar
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    @ToString.Exclude
    private Property property;

    //un (plot) sector solo pertenece a un cultivo (area)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_id", nullable = false)
    @ToString.Exclude
    private Crop crop;

    // Relación con PlotCondition (antes CropCondition)
    @OneToMany(mappedBy = "plot", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<PlotCondition> plotConditions;

}