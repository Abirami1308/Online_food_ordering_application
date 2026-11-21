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
@Table(name = "menus")
@Schema(description = "Represents a menu item")
public class Menu {
    @Schema(description = "Unique identifier of the menu item", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(description = "Name of the menu item", example = "Pepperoni Pizza")
    private String itemName;

    @Schema(description = "Description of the menu item", example = "Spicy pepperoni and mozzarella")
    private String description;

    @Schema(description = "Price of the menu item", example = "12.99")
    private Double price;

    @Schema(description = "Category of the menu item", example = "Main Course")
    private String category;

    @Schema(description = "Availability of the menu item", example = "true")
    private Boolean isAvailable;

    @Schema(description = "Restaurant ID associated with the menu item", example = "1")
    private Long restaurantId;
}
