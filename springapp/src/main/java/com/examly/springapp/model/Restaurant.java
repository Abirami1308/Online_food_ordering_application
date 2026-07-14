package com.examly.springapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "restaurants")
@Schema(description = "Represents a restaurant")
public class Restaurant {
    @Schema(description = "Unique identifier of the restaurant", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(description = "Name of the restaurant", example = "Pizza Palace")
    private String name;

    @Schema(description = "Address of the restaurant", example = "456 Oak St")
    private String address;

    @Schema(description = "Phone number of the restaurant", example = "9876543210")
    private String phoneNumber;

    @Schema(description = "Type of cuisine served", example = "Italian")
    private String cuisineType;

    @Schema(description = "Rating of the restaurant", example = "4.5")
    private Double rating;

    @Schema(description = "Active status of the restaurant", example = "true")
    private Boolean isActive;
}
