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
@Table(name = "payments")
@Schema(description = "Represents a payment transaction")
public class Payment {
    @Schema(description = "Unique identifier of the payment", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(description = "Order ID associated with the payment", example = "1")
    private Long orderId;

    @Schema(description = "Payment amount", example = "25.98")
    private Double amount;

    @Schema(description = "Mode of payment", example = "Credit Card")
    private String paymentMode;

    @Schema(description = "Status of the payment", example = "Success")
    private String paymentStatus;

    @Schema(description = "Transaction identifier", example = "TXN123456")
    private String transactionId;
}
