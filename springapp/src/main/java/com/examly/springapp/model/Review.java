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
@Table(name = "reviews")
@Schema(description = "Represents a user review")
public class Review {
    @Schema(description = "Unique identifier of the review", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(description = "User ID who wrote the review", example = "1")
    private Long userId;

    @Schema(description = "Order ID associated with the review", example = "12")
    private Long orderId;

    @Schema(description = "Restaurant ID being reviewed", example = "2")
    private Long restaurantId;

    @Schema(description = "Rating given by the user", example = "5")
    private Integer rating;

    @Schema(description = "Comment by the user", example = "Great food and fast delivery!")
    private String comment;

    @Schema(description = "Timestamp when the review was submitted")
    private java.time.LocalDateTime reviewDate;
}
