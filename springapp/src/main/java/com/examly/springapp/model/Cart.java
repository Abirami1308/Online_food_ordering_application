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
@Table(name = "carts")
@Schema(description = "Represents a cart item")
public class Cart {
    @Schema(description = "Unique identifier of the cart item", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(description = "User ID associated with the cart", example = "1")
    private Long userId;

    @Schema(description = "Menu item ID in the cart", example = "2")
    private Long menuItemId;

    @Schema(description = "Quantity of the menu item", example = "2")
    private Integer quantity;

    @Schema(description = "Special instructions for the item", example = "No onions")
    private String specialInstructions;
}
