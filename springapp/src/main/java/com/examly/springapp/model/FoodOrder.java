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
@Table(name = "orders")
@Schema(description = "Represents a food order")

public class FoodOrder {
@Schema(description = "Unique identifier of the food order", example = "1")
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Schema(description = "User ID who placed the order", example = "1")
private Long userId;

@Schema(description = "Name of the restaurant", example = "A2B")
private String restaurantName;

@Schema(description = "Type of cuisine served", example = "South Indian")
private String cuisineType;

@Schema(description = "Name of the menu item ordered", example = "Masala Dosa")
private String menuItemName;

@Schema(description = "Description of the menu item", example = "Crispy dosa served with potato masala, chutney and sambar")
private String menuItemDescription;

@Schema(description = "Price of one menu item", example = "120.50")
private Double menuItemPrice;

@Schema(description = "Quantity ordered", example = "2")
private Integer quantity;

@Schema(description = "Current status of the order", example = "Pending")
private String orderStatus;

@Schema(description = "Payment mode selected", example = "UPI")
private String paymentMode;

@Schema(description = "Restaurant ID associated with the order", example = "1")
private Long restaurantId;
}