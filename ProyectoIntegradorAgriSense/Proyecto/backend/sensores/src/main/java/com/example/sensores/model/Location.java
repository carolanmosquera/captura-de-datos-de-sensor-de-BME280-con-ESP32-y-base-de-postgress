package com.example.sensores.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "location")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La latitud es obligatoria")
    @Column(nullable = false)
    private Double latitude;

    @NotNull(message = "La longitud es obligatoria")
    @Column(nullable = false)
    private Double longitude;

    @Column(length = 255)
    private String description;

    @OneToMany(mappedBy = "location", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<Property> propertyList;

    //una locacion no deberia de tener una lista de sectores (plot), si no de  areas (crops)
    //y dentro de ellos estan los sectores (plots)
    @OneToMany(mappedBy = "location", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<Crop> crops;
}