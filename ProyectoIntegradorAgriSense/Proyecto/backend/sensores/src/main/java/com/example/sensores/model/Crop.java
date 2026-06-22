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
@Table(name = "crop")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 150)
    @Column(name = "scientific_name", length = 150)
    private String scientificName;

    @Size(max = 255)
    @Column(length = 255)
    private String description;

    //el crop que es el area que contiene los sectores (ej: ALMACEN A)
    //es el que deberia de ir con property

    //como el crop es el area, este deberia de contener al ESP-MASTER o un ESP-SLAVE
    //se debe de tener un atributo en donde se especifique si esa area (ALMACEN/CROP/CUARTO)
    //va a ser un punto central de conexion

    //BOOLEANO DE PUNTO CENTRAL DE CONEXION): si el area contiene un plot(sector) o varios (que tengan)
    //un ESP-MASTER, el atributo el TRUE y se considera esa area para extender red
    @Column(name = "is_central_node", nullable = false)
    private Boolean isCentralNode = false;// true si esta área (almacén) es punto central de conexión

    //un cultivo tiene varios sectores
    @OneToMany(mappedBy = "crop", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<Plot> plots;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    @ToString.Exclude
    private Location location;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;

}