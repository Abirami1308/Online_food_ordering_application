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
@Table(name = "deliveries")
@Schema(description = "Represents a delivery status details")
public class Delivery {
    @Schema(description = "Unique identifier of the delivery", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(description = "Order ID associated with the delivery", example = "1")
    private Long orderId;

    @Schema(description = "Name of the delivery partner", example = "Alex")
    private String deliveryPartnerName;

    @Schema(description = "Address for delivery", example = "123 Main St")
    private String deliveryAddress;

    @Schema(description = "Status of the delivery", example = "In Transit")
    private String deliveryStatus;

    @Schema(description = "Estimated delivery time in minutes", example = "30")
    private Integer estimatedTimeMinutes;

    @Schema(description = "Customer phone number", example = "9876543210")
    private String phoneNumber;
}
